# post-detail-markdown-rendering-plan 进度面板

| 任务/步骤名称 | 任务状态 | commit 信息与哈希值 |
|---|---|---|
| 1. 依赖调整（卸载 md-editor-v3，安装 vditor/markdown-it/highlight.js/@types/markdown-it） | 未完成 | - |
| 2. 发帖页编辑器迁移（MarkdownEditor.vue → Vditor，保持 v-model API） | 未完成 | - |
| 3. markdown → HTML 工具（src/utils/markdown.ts，hljs + 自定义 fence 渲染） | 未完成 | - |
| 4. 数据层改造（forumPostDetail.ts 改为 markdown 原文 + contentHtml） | 未完成 | - |
| 5. 详情渲染组件改造（PostContent.vue 整段渲染 + 复制委托 + mermaid 二次解析） | 未完成 | - |
| 6. 样式完善（hljs 主题、代码头部栏、pre code 字号、preflight 兼容） | 未完成 | - |
| 7. 退役清理（DiagramBlock/TableBlock/ContentBlock 类型移除） | 未完成 | - |
| 8. 构建与效果验证（vite build + dev 页面核验） | 未完成 | - |
