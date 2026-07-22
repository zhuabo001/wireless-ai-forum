# 贴文详情 Markdown 渲染重构 - 实施记录

**日期**: 2026-07-22

**分支**: `feat/post-detail-markdown-rendering`（基于 main，共 16 个 commit）

**目的**: 修复贴文详情页对 markdown 代码块渲染糟糕的根本问题 —— 原架构不存在 markdown 解析管线（详情页吃手工预切的 `ContentBlock[]`，代码块 `v-html` 未转义、无高亮），并与公司内部实际项目对齐（Vditor 编辑器 + 后端 `page.content` 整段 HTML 字符串模型 + 内嵌图片/mermaid 二次解析）。

**计划文档**: `docs/post-detail-markdown-rendering-plan.md` / `docs/post-detail-markdown-rendering-plan-progress.md`

## 渲染链路（改造后）

```
markdown 原文（数据层，模拟编辑器提交内容）
  → src/utils/markdown.ts（markdown-it + highlight.js，自定义 fence 渲染）
  → 整段 HTML 字符串（模拟后端 page.content）
  → PostContent.vue 整段 v-html 渲染
  → 挂载/内容变化后二次解析：mermaid 渲染 SVG、代码块复制按钮（事件委托）
```

## 修改文件

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `package.json` / `package-lock.json` | 修改 | 卸载 `md-editor-v3`；新增 `vditor`、`markdown-it`、`highlight.js`、`@types/markdown-it` |
| `src/pages/forum-new-topic/MarkdownEditor.vue` | 重写 | md-editor-v3 → Vditor（IR 模式、中文、`v-model` API 不变）；`cdn: '/vditor'` 指向本地化资源 |
| `src/utils/markdown.ts` | 新增 | markdown-it 实例（`html:false` 防注入）+ hljs 高亮；自定义 fence：代码块输出带"语言标识 + 复制按钮"头部栏的 `.code-block` 结构，mermaid 围栏输出二次解析占位结构 |
| `src/data/pageDesign/forumPostDetail.ts` | 重写 | `postContentBlocks: ContentBlock[]` → `postContentMarkdown`（原文）+ `postContentHtml`（转换结果）；其余导出（评论、资源链接等）不变 |
| `src/pages/forum-post-detail/PostContent.vue` | 重写 | 整段 v-html 渲染；复制按钮事件委托；mermaid 挂载后/watch 内容变化二次解析；代码块/表格/mermaid 样式；hljs github 主题 |
| `src/pages/forum-post-detail/Index.vue` | 修改 | `postContentBlocks` → `postContentHtml`，prop `blocks` → `html` |
| `src/types/pageDesign/forumPostDetail.ts` | 修改 | 删除 `ContentBlock` / `ContentBlockType` / `DiagramEngine` 类型 |
| `src/pages/forum-post-detail/DiagramBlock.vue` | 删除 | 切块模型退役（mermaid 逻辑内化到 PostContent） |
| `src/pages/forum-post-detail/TableBlock.vue` | 删除 | 切块模型退役（GFM 表格由 `.article-body` 样式接管） |
| `src/pages/forum-post-detail/MermaidDiagram.vue` | 删除 | 切块模型退役 |
| `public/vditor/` | 新增 | vditor 运行时资源本地化（lute/i18n/icons/highlight.js/mermaid/content-theme，约 8.5MB），解决默认 unpkg CDN 不可达导致编辑器初始化卡死 |
| `docs/post-detail-markdown-rendering-plan*.md` | 新增 | plan 与任务面板 |

## 关键决策

1. **编辑器对齐内部项目换 Vditor**，发帖/详情同一 markdown 生态（Vditor 底层同为 markdown-it，语法行为一致）。
2. **数据模型对齐内部 `page.content`**：`ContentBlock[]` 切块模型废弃，详情页消费整段 HTML 字符串；markdown→HTML 转换在数据层完成（真实链路中由后端承担）。
3. **代码块增强在转换期生成结构**（语言标识 + 复制按钮），Vue 侧仅挂事件委托，无渲染后 DOM 扫描与生命周期竞态。
4. **XSS 防线**：markdown-it `html:false`（源中 HTML 一律转义）+ 默认 `validateLink` 拦截 `javascript:`/`vbscript:`/`file:`/`data:` 链接与图片 + mermaid `securityLevel: 'strict'`。

## verification-agent 对抗检查发现并已修复的问题

| 严重度 | 问题 | 修复 |
|--------|------|------|
| P1 | mermaid 渲染失败时 fallback 源码不可见（内联 `display:none` 压制样式表） | 显隐改由 CSS 类控制（`da4067d`） |
| P2 | `html` prop 异步变化不重新解析 mermaid（内部接口异步返回内容会踩中） | `watch` + `nextTick` 重解析，已渲染块跳过 |
| P3 | 非安全上下文 `navigator.clipboard` 不存在时复制抛未捕获异常 | 存在性防御 |
| P3 | mermaid 动态 import 失败无兜底 | try/catch，失败全部回退源码展示 |

## 对其他模块的影响

- **评论区（wangEditor，产出 HTML 走 v-html）**：未触碰，行为不变；帖子（markdown）与评论（HTML）两种内容模型并存的割裂与内部项目一致，属已知现状。
- **论坛列表/路由/其他页面**：无改动、无影响。
- **构建**：`vite build` 通过；`public/vditor` 会原样拷入 dist。vue-tsc 存量基线错误（BeamsBackground `ctx` 空值、CSS side-effect TS2882、wangeditor 无类型声明等）不增不减。
- **bundle**：移除 md-editor-v3，新增 vditor（编辑器页路由级懒加载）；详情页 hljs 使用 `highlight.js/lib/common` 子集控制体积。

## 已知限制 / 后续建议

- `cdn: '/vditor'` 为绝对路径：若内部部署在子路径（如 `/app/`）需改为带部署前缀的地址（vite `base: './'` 下深层路由用相对路径亦有坑，建议按实际部署前缀配置）。
- markdown 源中的 `#`/`####` 等标题无专属样式（旧组件同样只覆盖 h2/h3，属持平非回归），需要时补充 `.article-body` 的 h1/h4 规则。
- plantuml 围栏目前按代码块展示源码（维持原 fallback 行为）；内部项目如后续接 Kroki 渲染，可在 `PostContent` 二次解析阶段扩展。
- `public/vditor` 8.5MB vendored 资源入 git；若介意仓库体积，可改为构建期用 `vite-plugin-static-copy` 从 node_modules 拷贝。
