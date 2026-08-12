# 框架依赖 CDN 化 vs 打包：利弊分析（2026-08-12）

> 背景问题：本项目 vue / vue-router / pinia 打包为 `vendor-vue` chunk（110KB min / 43KB gzip），
> 全站静态加载。能否改用公共 CDN（jsdelivr / unpkg）引入以加快加载？
>
> **结论：不划算。浏览器缓存分区已杀死跨站缓存红利，CDN 全局构建丢失 tree-shaking 后
> 字节数不降反升，且第三方源的新建连接开销常常超过 43KB 的下载时间。**
> 对本项目还有一票否决项：内网部署要求下公共 CDN 不可达 = 全站白屏。

## 面试速答版（30 秒）

> "2020 年后主流浏览器都做了 HTTP 缓存分区（Chrome 86+、Safari、Firefox），缓存按
> '顶层站点 + 资源 URL' 双键隔离，跨站共享 CDN 缓存的红利已经不存在了。
> 自建打包走 tree-shaking，vue 只需要 runtime-only；CDN 全局构建带完整模板编译器，
> 体积反而大约 35%。HTTP/2 下同域多路复用没有连接成本，而第三方 CDN 要多一次
> DNS + TCP + TLS 握手，对小文件来说握手时间往往超过下载时间。
> 所以现代实践是：依赖打进带 hash 的 vendor chunk + immutable 强缓存，
> 需要加速就把整个站点挂自有 CDN，而不是把单个依赖指向公共 CDN。"

## 一、问题量化（本项目实测数据）

| 项 | 值 |
| --- | --- |
| vendor-vue 构成 | vue + vue-router + pinia（@vueuse 未安装，正则预留） |
| 体积 | 110KB min / 43KB gzip |
| 加载方式 | 入口静态 + `index.html` modulepreload，同域 HTTP/2 并行 |
| 模板编译 | `@vitejs/plugin-vue` 构建期预编译，运行时无需 compiler |

## 二、CDN 方案的三个传统优势，逐一检验

### ❌ 1. "用户在其他网站已缓存过 CDN 上的 vue" —— 已被缓存分区杀死

这是 CDN 化最经典的论据，但已失效：

- **Chrome 86+（2020-10）、Safari（更早）、Firefox（85+）均实施 HTTP 缓存分区
  （cache partitioning / double-keyed caching）**；
- 缓存键从"资源 URL"变为"**顶层站点 origin + 资源 URL**"；
- 动机是防追踪（缓存探测可泄漏用户浏览历史）；
- 结果：用户在别的站点缓存的 `cdn.jsdelivr.net/vue@3/...` 对你的站点不可见，
  **首次访问必须全新下载，命中率趋近于零**。

### ⚠️ 2. "CDN 边缘节点离用户近" —— 成立，但有更好的实现

- 若源站单点部署、用户跨地域，边缘节点确实更快；
- 但正确做法是**把整个 `dist/` 挂自有 CDN**（部署层决策），
  而不是在构建层把依赖指向第三方——前者无版本漂移、无第三方可用性风险，收益相同。

### ❌ 3. "多域名突破浏览器并发连接数限制" —— HTTP/2 下已反转

- HTTP/1.1 时代每域 6 连接，域名分片（domain sharding）有意义；
- **HTTP/2 多路复用**下同域并行下载零额外成本；
- 指向第三方源反而要新建连接：**DNS 查询 + TCP 握手 + TLS 协商 ≈ 100–300ms**
  （移动端/弱网更高）。对 43KB gzip 的文件，**握手时间常超过传输时间**；
- 浏览器对同域 preload 的资源还能复用已建立的连接，首字节即开始下载。

## 三、CDN 化的隐性成本

### 1. 丢失 tree-shaking，字节数不降反升

| | 打包（tree-shaken） | CDN 全局构建（UMD/IIFE） |
| --- | --- | --- |
| vue | runtime-only 子集 | 完整构建（含模板编译器，约 +35%） |
| vue-router | 仅用到的 API | 完整构建 |
| pinia | 仅用到的 API | 完整构建 |
| **合计（估算）** | **110KB min / 43KB gzip** | **~160KB+ min / ~60KB+ gzip** |

关键点：现代构建流程中模板由插件预编译，运行时不需要 compiler；
而公共 CDN 的 `vue.global.prod.js` 只有"完整构建"一种形态。

### 2. 工程链路退化

- **版本漂移**：package.json 与 CDN 链接需人工同步，类型与运行时可能不一致；
- **SRI / CSP**：需维护 `integrity` 哈希，CSP `script-src` 要放行第三方源；
- **dev/prod 不一致**：dev 仍走本地打包，多一类"上线才发现"的故障面；
- **第三方可用性即你的可用性**：CDN 故障 / 被墙 / DNS 污染 = 全站不可用。

### 3. 本项目的一票否决项：内网部署

项目已有实证：vditor 默认从 unpkg 加载运行时资源，因"内网/离线环境会卡死初始化"
而本地化为 `/vditor`（见 `vite.config.ts` 中 viteStaticCopy 注释）。
若框架核心走公共 CDN，内网环境下不是某个功能降级，而是 **vue 本体加载失败、整站白屏**。
除非维护 CDN + 本地 fallback 双通道，复杂度远超收益。

### 4. 回访用户本就零成本

带内容 hash 的 chunk + `Cache-Control: public, max-age=31536000, immutable`，
回访用户在依赖升级前**永不重新下载**——与 CDN 缓存效果完全等价，且不依赖第三方。

## 四、对比总结表

| 维度 | 打包进 vendor chunk（现状） | 公共 CDN |
| --- | --- | --- |
| 首访下载量 | 43KB gzip | ~60KB gzip（无 tree-shaking） |
| 首访连接开销 | 0（同域复用 + modulepreload） | +100~300ms（新源握手） |
| 跨站缓存命中 | N/A | 已失效（缓存分区） |
| 回访 | hash + immutable，一次下载 | 等价 |
| 内网/离线可用 | ✅ | ❌ 致命 |
| 版本一致性 | lockfile 锁定 | 人工同步，可漂移 |
| 故障面 | 自有源 | +第三方源 |

## 五、什么时候 CDN 化（或类 CDN 方案）真的划算

1. **整个站点挂自有 CDN** —— 解决源站距离问题，部署层最优解；
2. **组织内多应用共享 vendor**：自建 ESM CDN + import map（微前端 / monorepo 场景），
   缓存分区不影响**同源**共享，这是"私有 CDN"而非公共 CDN；
3. **超大且低频的第三方资源**（如 3D 引擎、地图 SDK）且目标用户确定在公网，
   可接受第三方风险时——但即便如此也应优先 `import()` 动态加载而非外链 script。

## 六、行动项（本项目）

- [x] 保持 vue / vue-router / pinia 打包进 `vendor-vue`；
- [ ] 确认生产服务器对 `/assets/*` 返回 `Cache-Control: public, max-age=31536000, immutable`
      （hash 文件名下免费的最大回访优化）；
- [ ] 若用户跨地域，评估整站挂自有 CDN，而非改造构建。

## 参考

- Chrome 缓存分区公告（2020-10）："HTTP cache partitioning"（Chrome 86 起）
- 本项目 bundle 体检：`docs/bundle-health-report-2026-08-12.md`
