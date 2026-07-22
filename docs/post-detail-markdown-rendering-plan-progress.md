# post-detail-markdown-rendering-plan 进度面板

| 任务/步骤名称 | 任务状态 | commit 信息与哈希值 |
|---|---|---|
| 1. 依赖调整（卸载 md-editor-v3，安装 vditor/markdown-it/highlight.js/@types/markdown-it） | 完成 | chore(deps): replace md-editor-v3 with vditor, add markdown-it and highlight.js — bce45a2 |
| 2. 发帖页编辑器迁移（MarkdownEditor.vue → Vditor，保持 v-model API） | 完成 | feat: migrate new-topic markdown editor from md-editor-v3 to vditor — af54ce0 |
| 3. markdown → HTML 工具（src/utils/markdown.ts，hljs + 自定义 fence 渲染） | 完成 | feat: add markdown-it based markdown to HTML renderer with hljs and code header — ca15bbc |
| 4. 数据层改造（forumPostDetail.ts 改为 markdown 原文 + contentHtml） | 完成 | refactor: render post detail from markdown source as single HTML with code header and mermaid re-parsing — 2d35807（与任务5/6同提交，耦合改动避免中间态不可构建） |
| 5. 详情渲染组件改造（PostContent.vue 整段渲染 + 复制委托 + mermaid 二次解析） | 完成 | 同上 — 2d35807 |
| 6. 样式完善（hljs 主题、代码头部栏、pre code 字号、preflight 兼容） | 完成 | 同上 — 2d35807（hljs github 主题、.code-block 样式、pre code font-size 修复均含于 PostContent.vue 重写中，preflight 兼容性已逐项核对） |
| 7. 退役清理（DiagramBlock/TableBlock/ContentBlock 类型移除） | 未完成 | - |
| 8. 构建与效果验证（vite build + dev 页面核验） | 未完成 | - |
