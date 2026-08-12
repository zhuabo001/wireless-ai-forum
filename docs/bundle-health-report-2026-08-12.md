# Bundle 体检报告（2026-08-12）

分支：`feat/code-splitting-strategy`（基于 main@a67cfa7，含 unplugin-vue-components 按需引入）
数据来源：`vite build --manifest` 产物分析、`dist/.vite/manifest.json` 依赖图、chunk 内容 grep 取证。

## TL;DR

**发现一个严重问题：Vite 的 `__vitePreload` 运行时助手被 rolldown 分进了 `vendor-mermaid` chunk，
导致包括首页在内的所有页面静态加载并执行 3.0MB（gzip 783KB）的 mermaid chunk。**
当前首页实际加载 JS ≈ 3.43MB（gzip ≈ 932KB）；修复该静态边后预期 ≈ 433KB（gzip ≈ 148KB），
降幅约 87%。

## 产物清单（min / gzip）

| chunk | min | gzip | 说明 |
| --- | --- | --- | --- |
| vendor-mermaid | 2996.4KB | 783.4KB | mermaid + 内联的 cytoscape/dagre/d3 |
| vendor-wangeditor | 781.1KB | 262.0KB | 富文本编辑器 |
| vendor-common | 529.0KB | 159.8KB | vditor、highlight.js(common)、markdown-it 等 |
| vendor-katex | 253.2KB | 74.1KB | 被 mermaid chunk 动态引用 |
| vendor-element-plus | 246.4KB | 82.1KB | 按需引入后的 EP 子集 |
| vendor-vue | 108.4KB | 41.3KB | 框架核心 |
| index（入口） | 60.7KB | 18.6KB | 首页 + 共享业务代码 |
| vendor-lucide | 17.0KB | 6.0KB | 图标 |
| 8 个页面 chunk | 8.6–28.9KB | 3.6–11.2KB | 路由懒加载，粒度健康 |
| **合计** | **4.98MB** | — | — |

## 各路由真实加载图（manifest 静态边）

| 路由 | 静态加载（入口图之上追加） | 累计 JS（min） |
| --- | --- | --- |
| 首页 `/` | runtime + vendor-vue + vendor-element-plus + vendor-lucide + index + **vendor-mermaid** | ≈3.43MB |
| market | + 页面 chunk | ≈3.44MB |
| forum-post-detail | + vendor-common + vendor-wangeditor + 页面 chunk（vendor-mermaid 已在入口图） | ≈4.77MB |
| forum-new-topic | + vendor-common + vendor-wangeditor + 页面 chunk | ≈4.76MB |
| courses / practices / intelligence / toolbox / forum | + 页面 chunk（最小 8.6KB） | ≈3.44MB |

注意：`dist/index.html` 的 modulepreload 列表里没有 mermaid（被 `modulePreload.resolveDependencies`
过滤），但**静态 `import` 边依然存在**——预加载过滤只影响 hint，不影响运行时加载。这是一个
容易误导的信号：看 HTML 以为首页很轻，实际很重。

## 发现明细

### P0：`__vitePreload` 助手落入 vendor-mermaid，全站静态加载 3MB —— ✅ 已修复

**修复**：`vite.config.ts` codeSplitting 增加 `{ name: 'vite-runtime', test: /vite\/preload-helper/, priority: 100 }`，
将 Vite 运行时助手钉入独立的 1.2KB chunk。

**验证证据**（`vite build --manifest` + `npm run check` 通过）：

- 入口静态边修复后：runtime + vite-runtime(1.2KB) + vendor-vue + vendor-element-plus + vendor-lucide，
  manifest 确认 `index.html` 对 vendor-mermaid 无静态边。
- post-detail 对 vendor-mermaid 仅剩动态边（`await import('mermaid')` 按需触发）。
- 修复后首页加载 JS ≈ 435KB（gzip ≈ 149KB），对比修复前 ≈ 3.43MB（gzip ≈ 932KB），降幅 87%。

<details>
<summary>原始证据链（修复前）</summary>

1. `dist/assets/index-*.js` 首行存在 `import{_ as R}from"./vendor-mermaid-*.js"`（静态 import）。
2. vendor-mermaid 导出表 `export{Ht as _,...}`；`Ht` 定义为
   `Ht=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName("link")...`，
   紧邻 `modulepreload` 字符串——即 Vite 注入的 `__vitePreload` 动态导入预加载助手。
3. manifest 中 `index.html` 条目对 vendor-mermaid 为静态 `imports` 关系。

根因：`vite/preload-helper` 是虚拟模块，路径不匹配任何分组的 `/node_modules/` 正则；
rolldown 将其分配给了 mermaid 分组 chunk，任何动态 import 的 chunk 都静态依赖它。
</details>

### P1：post-detail 静态加载 wangeditor（781KB）

`CommentEditor.vue` / `CommentItem.vue` 顶部静态 `import { Editor, Toolbar } from
'@wangeditor/editor-for-vue'`。浏览帖子（只读场景）也要付出编辑器成本。可延后到用户点击
"写评论/回复" 时动态加载。

### P2：死代码与失效配置

- `gsap` 在 dependencies 中但 src 零引用（`rg` 确认）；配置中 `vendor-gsap` 分组为空。
- `vendor-md-editor` 分组匹配的 `md-editor-v3` 未安装，分组为空。
- `vendor-dagre` 分组（dagre|d3-|lodash-es）为空——cytoscape/dagre/d3 实际被内联进
  vendor-mermaid chunk（chunk 内 grep 到对应标识）。
- `element-plus/dist/index.css` 全量 CSS 已移除（上次任务），EP JS 已按需，但首页因
  AgentMarketSection 使用 ElButton 而静态加载 246KB EP chunk——可接受，暂不建议拆分。

### 正常项

- mermaid 本体已是动态 import（`PostContent.vue` 仅在存在 `.mermaid-block` 时 `await import('mermaid')`），
  问题纯粹是 preload-helper 放错 chunk，不是业务代码静态引了 mermaid。
- 页面级路由分包粒度健康（8–29KB/chunk）。
- highlight.js 使用 `lib/common` 子集，未全量引入。
- vendor-katex 由 mermaid chunk 动态引用，不污染首屏。

## 修复建议（按预期收益排序）—— 待办跟踪

| # | 动作 | 预期收益 | 风险 | 状态 |
| --- | --- | --- | --- | --- |
| 1 | 给 codeSplitting 增加高优先级分组，将 `vite/preload-helper` 固定到独立小 chunk | 首屏 -3.0MB（-87%） | 低 | ✅ 已完成（见 P0） |
| 2 | 卸载 `gsap`；删除 `vendor-gsap` / `vendor-md-editor` 空分组；修正或删除 `vendor-dagre` 分组 | 配置与现实对齐，无体积变化 | 低 | ⬜ 待办 |
| 3 | post-detail 的评论编辑器改为交互时动态 import | 帖子页 -781KB | 中，需处理编辑器加载态 | ⬜ 待办 |
| 4 | new-topic 的 vditor 由模块级静态 import 改为挂载时动态 import | 发帖页按需加速（vendor-common 部分） | 中 | ⬜ 待办 |
| 5 | 浏览器实测（Lighthouse / 网络瀑布）验证修复后首屏指标 | 实测确认，非体积变化 | 低 | ⬜ 待办 |

> 待办 #2–#5 的承载文档即本报告；完成后在状态列打勾并补充证据。

## 未验证项

- 分组正则 `/vite\/preload-helper/` 已成功匹配 rolldown 的 helper 模块（构建产物验证，`vite-runtime` chunk 已生成）。
- 未做浏览器实测（Lighthouse / 网络瀑布），上述加载图基于 manifest 静态边推导（已列为待办 #5）。
