# Lighthouse 性能基线（2026-08-12）

> 优化分支 `feat/lighthouse-perf-optimization` 的起点基线。后续每项优化落地后应在本文件追加对比记录。

## 测量方法

- 构建：`npm run build`，`vite preview`（localhost:4173）服务生产产物
- 工具：Chrome DevTools MCP `performance_start_trace`（Performance 维度）+ `lighthouse_audit`（无障碍/SEO/最佳实践）
- 环境：桌面端、**无 CPU/网络节流**、本地回环
- **注意**：无节流 + localhost 的实验室数据只用于优化前后**相对对比**，不代表线上真实用户绝对值。真实网络下 JS 传输成本会进一步放大 render delay 的差距。

## 核心结论

**两页 FCP ≈ LCP，SPA 一次性绘制，LCP 的 97–99% 是 Render delay（主线程 JS 执行），网络与 TTFB 几乎无损耗。**

| 指标 | 首页 `/` | 帖子详情 `/forum/post/1` |
| --- | --- | --- |
| TTFB | 13 ms | 3 ms |
| FCP | 379 ms | 320 ms |
| LCP | 379 ms（P 文本节点） | 320 ms（P 文本节点） |
| Render delay 占 LCP | 96.8%（367 ms） | 99.2%（317 ms） |
| CLS | 0.00 | 0.00 |
| FCP 前主线程繁忙 | 314 ms | 247 ms |
| 最长单个任务 | 226 ms | 180 ms |

关键链路（帖子详情页）：`HTML → index.js + index.css + vendor-element-plus.css`，最大关键路径延迟仅 45 ms。
modulepreload 过滤（vendor-mermaid/katex/wangeditor/vditor 不预加载）工作正常，未进入关键链。

**结论：当前瓶颈不在网络层、不在分包结构，而在主线程一次性求值/执行的 JS 总量。** 分包体检报告（`bundle-health-report-2026-08-12.md`）中标记的 vendor-element-plus（246.5 KB）与 vendor-common（248.9 KB）体积，正是通过这里的主线程繁忙时间体现为 FCP/LCP 延迟。

## 其他维度得分

| 维度 | 首页 | 帖子详情 |
| --- | --- | --- |
| Accessibility | 83 | 82 |
| Best Practices | 100 | 100 |
| SEO | 92 | 92 |

### 失败审计项

| 审计项 | 首页 | 帖子详情 |
| --- | --- | --- |
| button-name（按钮无可访问名称） | ❌ | ❌ |
| color-contrast（对比度不足） | ❌ | ❌ |
| robots-txt（robots.txt 无效） | ❌ | ❌ |
| heading-order（标题层级跳级） | ❌ | — |
| link-name（链接无可辨识名称） | ❌ | — |
| aria-input-field-name | — | ❌ |
| label（表单元素无关联标签） | — | ❌ |
| landmark-one-main（缺少 main 地标） | — | ❌ |
| agent-accessibility-tree / llms-txt（Agentic Browsing 维度） | ❌ | ❌ |

## 原始产物

`docs/reports/lighthouse-baseline/` 下（体积较大，不建议入库，本地留存）：

| 文件 | 内容 |
| --- | --- |
| `home-trace.json.gz` / `post-detail-trace.json.gz` | Performance trace 原始数据（可拖入 DevTools Performance 面板复查） |
| `home-report.json/.html` / `post-detail-report.json/.html` | Lighthouse 无障碍/SEO/最佳实践完整报告 |

## 优化方向（按预期收益排序）

1. **削减首屏 JS 执行量**（render delay ≈ 全部）：vendor-element-plus 按需粒度、首页折叠线下 section 懒加载
2. **长任务拆解**：226 ms 单任务会同时在真实设备上放大为 INP 风险
3. 无障碍与 SEO 失败项修复（独立维度，不影响 Performance 分）
4. robots.txt / llms.txt 合规化

---

## 优化记录 1：首页区块懒加载 + 切断 EP 静态边（2026-08-12）

**归因**（source-map-explorer 生成字节级）：vendor-element-plus 246KB 中首页真正使用的仅
ElButton/ElTag/ElCalendar/ElDialog（约 15KB），select/upload/form/async-validator 等约 190KB
为懒加载页面专用，但因强制分组 + HeroSection 静态引用 ActivityCalendar（ElCalendar），
整个 chunk 被压在首页关键路径。

**改动**：
- `HomeSection.vue`：IntersectionObserver 可见性门控（rootMargin 400px 预加载），占位 minHeight 防 CLS
- `HomePage.vue`：HeroSection 保持静态，其余 9 个区块 defineAsyncComponent
- `HeroSection.vue`：ActivityCalendar 改异步组件（EP 静态边的最后一处来源）
- `data/home.ts` / `types/home.ts`：homeSections 增加 minHeight（实测高度）

**效果**（同一无节流 lab 环境对比）：

| 指标 | 基线 | 优化后 | 变化 |
| --- | --- | --- | --- |
| FCP | 379.3 ms | 313.9 ms | **-17%** |
| LCP | 379 ms | 314 ms | **-17%** |
| FCP 前主线程繁忙 | 314.3 ms | 276.8 ms | -12% |
| 最长单任务 | 225.6 ms | 167.5 ms | **-26%** |
| CLS | 0.00 | 0.00 | 无回归 |
| 首页关键路径 JS | 436 KB | 171 KB | **-61%** |
| 首页关键路径 CSS | index.css + EP 90.8KB | 仅 index.css 36.8KB | EP 样式移出 |

入口静态依赖仅剩 vite-runtime + vendor-vue + vendor-lucide；vendor-element-plus（252KB）
与 9 个区块 chunk（各 1–4.7KB）全部变为按需加载。`npm run check` 通过（含 verify-build
深链与懒加载边界校验），滚动冒烟 9 区块均正常挂载，控制台零告警。

**注**：无节流 lab 的绝对差值偏小，4x CPU 节流下相对收益预计放大 3–4 倍。

---

## 优化记录 2：highlight.js 按需注册瘦身（2026-08-12）

**归因**：vendor-common 248KB 中约 150KB 为 `highlight.js/lib/common`（37 种语言全量
注册），而论坛围栏语言实际只需 python/text/plantuml/mermaid 等少量。

**改动**：`src/utils/markdown.ts` 改为 `lib/core` + 精选 14 种语言按需注册
（python/javascript/typescript/java/c/cpp/bash/sql/json/xml/yaml/go/rust/matlab），
未注册语言走已有纯转义降级；别名（js/ts/c++/sh/html）由 registerLanguage 自动注册。

**效果**：

| 项 | 优化前 | 优化后 |
| --- | --- | --- |
| vendor-common JS | 248 KB | 170.9 KB（**-77KB/-31%**） |
| gzip | ~87 KB | 67.9 KB |

功能验证全绿：python 高亮、text/plantuml 降级转义、mermaid SVG 正常渲染、控制台零告警。
`npm run check` 通过。

**诚实结论**：帖子页 3 轮复测 FCP 中位数 335.8ms（范围 218.7–472.4ms），与基线单跑
319.7ms 在无节流 lab 下无法区分——噪声带 ±120ms 量级，远超 77KB minified 的桌面解析
成本（~2–5ms）。本步的可度量收益是确定性的传输与解析削减，真实网络/低端设备上兑现。
节流下的严格对比留待里程碑 5 统一执行。
实施记录：`docs/perf-imprv-records/lighthouse-perf-milestone2-hljs-slim-2026-08-12.md`

---

## 优化记录 3：4x CPU 节流发布级对比（M5，2026-08-13）

**性质**：纯测量里程碑，无源码改动。兑现记录 1/2 的"节流对比留待 M5"承诺与
"4x 节流下收益预计放大 3–4 倍"预测。协议：基线提交（153fb11）与 HEAD 生产产物
在同一 Chrome 会话内、同协议 4x CPU 节流（1280×800@2x、无网络节流、预热后）
各测 3 轮。详见实施记录
`docs/perf-imprv-records/lighthouse-perf-milestone5-throttled-comparison-2026-08-13.md`。

### 首页 `/`（4x 节流，3 轮中位数）

| 指标 | 基线 | HEAD | 变化 |
| --- | --- | --- | --- |
| LCP | 634 ms（595–1062） | 361 ms（351–373） | **−43%** |
| 最长挂载任务 | 412.0 ms | 186.1 ms | **−55%** |
| FCP 前主线程繁忙 | 569.5 ms | 373.5 ms | **−34%** |
| CLS | 0.00 | 0.00 | 无回归 |

**节流放大预测验证**：百分比口径 −17%→−43% = 放大 2.5 倍；绝对差值口径
65→273 ms = 放大 4.2 倍。预测成立（2.5–4.2x，视口径）。

### 帖子详情 `/forum/post/1`（4x 节流）

LCP 中位数 677 → 670 ms（−1%，噪声内）。hljs 77KB 瘦身在 localhost 无传输
成本的实验室不可测——记录 2 的诚实结论在节流下复现，非回归。

### 挂载任务修复复测与 rAF 复核（M3b 欠账结清）

- 挂载任务内 Layout @4x：HEAD 64.9–74.1ms ≈ M3b 后测 17.05ms × 4（标度一致）；
  基线 97–115ms 对应全页静态挂载 + 强制回流双布局。M3b 修复在节流下无回归。
- 光束动画 rAF 每帧主线程成本 @4x：**3.2–3.5ms**（M3b 预测 3.56ms 命中），
  峰值 ≤8.4ms，远低于帧预算，维持"无需改动"判决。

### 导航交互延迟（INP 实验室代理，4x 节流）

| 交互 | EventTiming click duration | 路由内容挂载 | input delay |
| --- | --- | --- | --- |
| 首页→论坛（HEAD） | 64 ms | 60 / 66 ms | 3–18 ms |
| 首页→论坛（基线） | 64–80 ms | 76 / 63 / 83 ms | 5–6 ms |
| 日历「上个月」（HEAD） | 64 ms | — | 2–5 ms |

全部远低于 200ms 良好阈值。边界：localhost 无 chunk 传输成本，真实网络下
导航预取（M3b 建议 3）的收益仍开放。

### 冷会话地板（新增文档化底线）

隔离上下文冷缓存首载 @4x：**FCP 1104 / LCP 1103 ms**（暖态 ~360ms）。
冷载强制回流 610ms 归因 Vue 挂载路径 ≈ 无节流 150ms，与 M3 实验的冷字体
地板（118ms 无节流，浏览器会话级一次性成本）同量级——**节流下以 ~4x 放大
重现，应用层不可消除**，仅影响会话内首次访问。

### 节流环境下的综合画像（回填核心结论）

无节流实验室的相对收益方向与节流下一致、量级被放大：首页 LCP 全链路优化
（M1 懒加载 + M2 瘦身 + M3b 挂载修复）在 4x 节流下兑现 **−43%**，且 CLS 保持
0.00。渲染侧交互路径健康（≤83ms），性能风险剩余项在网络侧（真实网络 chunk
传输与传输体积），非本地实验室可测。
