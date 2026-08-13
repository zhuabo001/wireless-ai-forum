# 里程碑 2：highlight.js 按需注册瘦身（2026-08-12）

> 分支：`feat/lighthouse-perf-optimization`（里程碑 1 已合入 main，本里程碑在其后继续）。
> 前序：`lighthouse-perf-milestone1-lazy-sections-2026-08-12.md`。

## 1. 背景与目标

里程碑 1 解决了首页的 vendor-element-plus 静态边。本里程碑转向帖子详情页的
vendor-common（248KB）：归因显示其中约 150KB 是 `highlight.js/lib/common`——37 种语言
的全量注册（含 swift/php/less/scss 等无线 AI 论坛低频语言），而实际 mock 数据的围栏语言
只有 python / text / plantuml / mermaid 四种。目标是按需注册精选语言集，削减帖子页
首次加载的 JS 传输与解析成本。

## 2. 数据来源

- 体积归因：`npx vite build --sourcemap` + `source-map-explorer`（生成字节级，里程碑 1
  已验证该工具可靠性；自写 sourcemap 脚本曾产出荒谬数据，已弃用）
- 语言使用面：对 `src/data/pageDesign/forumPostDetail.ts` / `forum.ts` 扫描围栏标注
- 体积验证：`vite build --manifest` 输出 vendor-common 尺寸
- 行为验证：浏览器实测 python/text/plantuml/mermaid 四种围栏渲染 + 控制台检查
- 性能对比：帖子详情页 Performance trace（对比对象为优化前基线
  `post-detail-trace.json.gz`）

## 3. 方案

`highlight.js/lib/common` → `lib/core` + `registerLanguage` 精选 14 种：

python、javascript、typescript、java、c、cpp、bash、sql、json、xml（覆盖 html 别名）、
yaml、go、rust、**matlab**（无线/信号处理工程师高频语言，common 中原本不含）。

未注册语言已有优雅降级（`markdown.ts` 中 `hljs.getLanguage` 检查失败 → 纯转义输出），
高亮缺失不会破损体验。v11 语言定义自包含，注册顺序无依赖；语言自带别名（js/ts/c++/sh 等）
由 `registerLanguage` 一并注册，无需手工映射。

## 4. 实际动作

单文件改动 `src/utils/markdown.ts`：

- import 从 `highlight.js/lib/common` 改为 `lib/core`
- 增加 14 个语言模块 import + 注册调用
- 更新注释：说明裁剪依据、降级行为、v11 自包含与别名机制

## 5. 遇到的问题与解决

### 问题 1：单次无节流 trace 出现"反直觉"结果

首测 FCP 335.8ms 比基线 319.7ms 还慢 16ms，主线程繁忙 289.6 vs 247.2，与 -77KB 的
削减方向矛盾。**分析**：无节流 localhost 单次测量噪声带约 ±30–50ms，而 77KB minified JS
在桌面端的解析成本仅 ~2–5ms，低于噪声底；MCP 浏览器会话经历断连重启，运行环境也存在
波动。**处理**：不宣称 FCP 收益，以确定性证据（-77KB 传输 + 解析成本）作为本里程碑的
核心结论；4x CPU 节流下的严格前后对比按计划留到里程碑 5 统一执行。

**多轮补测坐实噪声判断**（MCP 恢复后补采 3 次）：

| 轮次 | FCP | FCP 前主线程繁忙 | 最长任务 |
| --- | --- | --- | --- |
| 断连前 | 335.8 ms | 289.6 ms | 161.6 ms |
| run2 | 472.4 ms | 335.2 ms | 162.8 ms |
| run3 | 218.7 ms | 146.2 ms | 106.1 ms |
| 中位数 | 335.8 ms | 289.6 ms | 161.6 ms |

同一产物、同一 URL，三轮 FCP 散布在 218.7–472.4ms（极差 254ms）——噪声带远超预期
（±120ms 量级），与基线单跑的 319.7ms 无法区分。这实证了：无节流 lab 只能做
**量级级（百毫秒以上）**的结论，毫秒级的解析成本差异必须依赖节流放大（里程碑 5）。

### 问题 2：MCP 浏览器 profile 锁竞争

chrome-devtools MCP 多次断连重连，产生 4 组互相竞争的服务实例（9:36/9:53/9:54/12:21
各一组），每组都试图在同一 `chrome-profile` 目录启动 Chrome，报
"browser is already running"。**解决**：`pkill` 全部 `chrome-devtools-mcp` 与
`chrome-profile` 相关进程，等待服务重生单一干净实例后继续。

### 问题 3：evaluate_script 的非法 CSS 选择器

验证高亮时用了 `.hljs-*` 通配选择器，querySelector 抛 SyntaxError。**解决**：改为取全部
span 后按 className 包含 `hljs` 过滤。

### 问题 4：注释中的错误技术断言

初版注释声称"注册顺序有依赖：cpp 依赖 c、typescript 依赖 javascript"。查证 v11 源码：
typescript.js 内部自带 `function javascript(hljs)`（第 170 行）、cpp.js 无外部依赖，
语言定义完全自包含。**修正**：注释改为如实描述 v11 的自包含特性与别名自动注册。

## 6. 最终效果

| 项 | 优化前 | 优化后 | 变化 |
| --- | --- | --- | --- |
| vendor-common JS | 248 KB（min） | 170.9 KB | **-77KB（-31%）** |
| vendor-common JS gzip | ~87 KB | 67.9 KB | -19KB |
| 注册语言数 | 37 | 14 | 低频设计/配置类语言移除 |

功能验证（浏览器实测帖子详情页）：

| 围栏 | 行为 | 结果 |
| --- | --- | --- |
| python | hljs 高亮（6 个 token span） | ✅ |
| text | 纯转义输出 | ✅ |
| plantuml（未注册） | 回退纯转义 | ✅ |
| mermaid | 独立渲染管线，SVG 正常 | ✅ |
| 控制台 | 零 error / 零 warning | ✅ |

`npm run check` 通过（含 verify-build 深链与懒加载边界校验）。

**诚实结论**：无节流本地单次 trace 的 FCP 差异（+16ms）在噪声带内，本里程碑的可度量
收益是确定性的 -77KB 传输与解析成本——这在真实网络与低端设备上体现为帖子页加载改善；
节流下的正式前后对比留待里程碑 5。

## 7. 后续方向

1. 里程碑 3：首页残余 render delay（299ms）——ElCalendar（dayjs+calendar）替换或延迟、
   167ms 长任务 requestIdleCallback 拆解
2. 里程碑 4：无障碍 8 项失败审计 + robots.txt/llms.txt 合规
3. 里程碑 5：4x CPU 节流发布级对比，全部数字回填基线报告
