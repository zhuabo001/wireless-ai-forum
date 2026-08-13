# 里程碑 1：首页区块懒加载与 Element Plus 静态边切除（2026-08-12）

> 分支：`feat/lighthouse-perf-optimization`。本文记录该里程碑从基线测量到落地验证的完整过程，
> 包括数据来源、方案选型、实际动作、踩坑与解决、最终效果。对比数据同步沉淀于
> `docs/reports/lighthouse-baseline-2026-08-12.md`。

## 1. 背景与目标

分包体检（`docs/reports/bundle-health-report-2026-08-12.md`）已给出体积视角的嫌疑名单：
vendor-element-plus 246.5KB、vendor-common 248.9KB。但体积数字不等于性能损耗，本里程碑的
目标是：**用浏览器实测数据确认瓶颈环节，实施第一项优化，并用同一测量管线验证收益**。

## 2. Baseline 数据来源

### 测量管线

1. `npm run build` 产出生产构建，`vite preview`（localhost:4173）本地服务
2. Chrome DevTools MCP `performance_start_trace` 采集 Performance trace（LCP/FCP/CLS/长任务）
3. `lighthouse_audit` 采集无障碍/SEO/最佳实践得分
4. 原始 trace 落盘后用 Python 解 gzip 提取 FCP、FCP 前主线程繁忙时间、最长单任务
   （trace 摘要不直接给这三项，需从 `firstContentfulPaint` / `RunTask` 事件计算）

### 环境约定

桌面端、**无 CPU/网络节流**、本地回环。绝对值偏小，只用于优化前后**相对对比**；
真实网络与中端设备下差距会放大。

### 基线数字

| 指标 | 首页 `/` | 帖子详情 `/forum/post/1` |
| --- | --- | --- |
| TTFB | 13 ms | 3 ms |
| FCP = LCP | 379 ms | 320 ms |
| Render delay 占 LCP | 96.8% | 99.2% |
| FCP 前主线程繁忙 | 314 ms | 247 ms |
| 最长单任务 | 226 ms | 180 ms |
| CLS | 0.00 | 0.00 |

**结论**：FCP ≈ LCP（SPA 一次性绘制，首屏 paint 前无中间态），LCP 的 97–99% 是
Render delay（主线程 JS 求值/执行），网络与 TTFB 几乎无损耗。瓶颈在主线程，
优化方向 = 减少首次绘制前要下载、求值、执行的 JS 总量。

原始产物：`docs/reports/lighthouse-baseline/`（trace 与 Lighthouse 报告，体积大，
已通过 `.gitignore` 排除，仅本地留存）。

## 3. 归因：两个大 chunk 里到底装了什么

不看成分就优化等于盲猜。用一次性 `vite build --sourcemap`（不改配置、不装依赖）+ 工具
分析生成字节构成：

| Chunk | 真实构成 | 结论 |
| --- | --- | --- |
| vendor-element-plus 246KB | select 27KB、upload 13KB、form 10KB、async-validator 16KB、tinycolor 14KB、popper 19.5KB 等 | 首页实际只用 ElButton/ElTag/ElCalendar/ElDialog（约 15KB），**约 190KB 是懒加载页面专用却被连坐** |
| vendor-common 248KB | highlight.js 约 150KB（`lib/common` 含 37 种语言）+ markdown-it 链 | 只在懒加载帖子页，不影响首页；留作下一里程碑 |
| vendor-vue 110KB | Vue 运行时 78KB + router 22KB + pinia 6KB | 接近不可压缩；@vueuse 实际只有 5KB（此前担心多余） |

**根因**：`vite.config.ts` 的 `codeSplitting.groups` 用路径正则把**所有** EP 模块强制塞进
一个 chunk；只要入口静态图引用任意一个 EP 组件，整条 246KB 就成为首页静态依赖。

## 4. 方案选型

### 失败的实验：naive 移除分组

第一反应是删掉 vendor-element-plus 分组让 rolldown 自动拆。实测**更差**：EP 模块全部掉进
catch-all 的 vendor-common（248KB → 477.8KB），且仍是首页静态依赖。原因：catch-all
`test: /node_modules/` 会接住一切没有专属分组的模块。实验后用备份恢复了 `vite.config.ts`。

### 三条候选路径

| 方案 | 机制 | 取舍 |
| --- | --- | --- |
| A. 区块懒加载 | 折叠线下区块异步化后，入口静态图零 EP 引用，整个 EP chunk 自然变懒加载 | 收益最大（关键路径 -246KB JS、-90.8KB CSS），同时砍掉区块自身 JS；需占位高度防 CLS |
| B. 双分组配置 | 正则剥离懒加载专用组件到独立分组 | 纯配置无 UX 变化，但清单需人工维护，新增组件漏配会静默回退 |
| C. 两者都做 | 先切静态边再归拢 chunk | 收益最全，改动面最大 |

**选定方案 A**（用户决策）：首页 EP 使用点全部位于折叠线下区块
（AgentMarketSection / ActivityCalendar / EngineeringSection→ImageModal），具备切除条件。

## 5. 实际动作

| 文件 | 改动 |
| --- | --- |
| `src/components/layout/HomeSection.vue` | 新增 IntersectionObserver 可见性门控：`minHeight` 存在时先渲染占位壳，进入视口前 400px（rootMargin）才挂载真实组件；含无 IO 环境的降级 |
| `src/pages/HomePage.vue` | HeroSection 保持静态导入（LCP 所在区块）；其余 9 个区块改 `defineAsyncComponent` |
| `src/sections/HeroSection.vue` | `ActivityCalendar` 改 `defineAsyncComponent`（见第 6 节问题 2） |
| `src/data/home.ts` / `src/types/home.ts` | `HomeSectionMeta` 新增 `minHeight` 字段，取各区块桌面端实测渲染高度（通过浏览器 `offsetHeight` 实测：engineering 1246 / forum 945 / courses 896 …） |

## 6. 遇到的问题与解决

### 问题 1：自写 sourcemap 归因脚本数据荒谬

按 `sourcesContent` 统计时整个 barrel 文件被计入（icons-vue 显示 313KB）；改写 VLQ
mappings 解析后更离谱（lodash-es 219KB、uc.micro 93KB——比这些库本身的完整体积还大，
段间隙被错误归因给前一个源）。**解决**：不自造轮子，改用 `npx source-map-explorer`
（生成字节级归因，无法映射字节仅 0.47%），得到可信构成。教训：barrel 模块的 sourcesContent
体积 ≠ 产物贡献体积；sourcemap 归因有边缘情况，用成熟工具。

### 问题 2：区块全部懒加载后，入口仍静态引用 EP chunk

9 个区块异步化、grep 确认静态图文件零 EP 引用后，manifest 显示 entry → vendor-element-plus
静态边依然存在。**定位**：对 entry chunk 的 sourcemap 列出全部 src 模块，发现
`ActivityCalendar.vue` 仍在入口——它被**静态的 HeroSection** 内部引用（hero 下半屏的活动
日历，ElCalendar 用户）。**解决**：HeroSection 内将 ActivityCalendar 改为
`defineAsyncComponent`，挂载后并行拉取、不阻塞首屏绘制。此后入口静态依赖收敛为
vite-runtime + vendor-vue + vendor-lucide，EP 的 JS 与 CSS 全部移出关键路径。

**教训**：chunk 级依赖图（manifest）只能告诉你"有边"，不能告诉你"哪条模块路径形成的边"；
逐 chunk 列出 sourcemap sources 是定位隐藏静态边的有效手段。

### 问题 3：懒加载的 CLS 风险

区块高度未知，占位与实际高度不一致会产生布局偏移。**解决**：浏览器实测每个区块的
`offsetHeight` 写入 `minHeight` 占位；IntersectionObserver 设 `rootMargin: 400px` 提前触发，
使占位→真实内容的切换发生在视口之外。复测 CLS 维持 0.00。

### 问题 4：zcat 读取 trace 失败

macOS 沙箱内 `zcat` 对绝对路径报 "can't stat … .Z"。**解决**：改用 Python `gzip.open`
直接解析，同时顺带用同一脚本完成 FCP/主线程繁忙的提取。

## 7. 最终实现效果

| 指标 | 基线 | 优化后 | 变化 |
| --- | --- | --- | --- |
| FCP | 379.3 ms | 313.9 ms | **-17%** |
| LCP | 379 ms | 314 ms | **-17%** |
| FCP 前主线程繁忙 | 314.3 ms | 276.8 ms | -12% |
| 最长单任务 | 225.6 ms | 167.5 ms | **-26%** |
| CLS | 0.00 | 0.00 | 无回归 |
| 首页关键路径 JS | 436 KB | 171 KB | **-61%** |
| 首页关键路径 CSS | index.css + EP 90.8KB | 仅 index.css 36.8KB | EP 样式移出 |

无节流 lab 下差值偏小，4x CPU 节流的真实设备上相对收益预计放大 3–4 倍（LCP 改善约
200–260ms 量级）。

### 验证证据

- `npm run check` 通过（含 verify-build 深链资源路径与懒加载 vendor 边界校验）
- 浏览器滚动冒烟：9 个懒加载区块全部正常挂载，ElCalendar 正常渲染
- 控制台零 error / 零 warning
- 复测 trace：`docs/reports/lighthouse-baseline/home-trace-after-lazy-sections.json.gz`

## 8. 后续方向

1. **highlight.js 瘦身**（帖子页）：`lib/common` 37 种语言改按需注册约 12 种，vendor-common
   预计 -100KB，作用于帖子详情 320ms 的 LCP
2. 剩余 render delay 约 299ms 主要为 vendor-vue（接近不可压缩）与应用挂载本身，进一步
   收益需要考虑更长任务拆解或 ElCalendar 替换为轻量实现（可再省 dayjs + calendar 约 16KB）
3. 无障碍 82–83 分的 8 项失败审计与 robots.txt 合规化（独立维度）
