# 论坛帖子正文图表渲染（Mermaid）— 任务进度

| 步骤 | 任务名称 | 状态 | Commit 信息 & 哈希 |
|------|----------|------|---------------------|
| Step 1 | 类型定义扩展：`ContentBlockType` 新增 `'diagram'`，`DiagramEngine` 类型，`ContentBlock` 新增 `engine`/`source` 字段 | ✅ 完成 | `feat(types): add 'diagram' ContentBlockType, DiagramEngine type, engine/source fields to ContentBlock` — `63f9bfa` |
| Step 2 | 安装 `mermaid` npm 依赖 | ✅ 完成 | `feat(deps): install mermaid@11.16.0 for client-side diagram rendering` — `92f4188` |
| Step 3 | 新建 `DiagramBlock.vue` 分发组件 | ✅ 完成 | `feat(diagram): add Mermaid diagram rendering to post content` — `d33a08b` |
| Step 4 | 新建 `MermaidDiagram.vue` Mermaid 客户端渲染组件 | ✅ 完成 | `feat(diagram): add Mermaid diagram rendering to post content` — `d33a08b` |
| Step 5 | 修改 `PostContent.vue` 接入 `diagram` 分支 | ✅ 完成 | `feat(diagram): add Mermaid diagram rendering to post content` — `d33a08b` |
| Step 6 | 数据文件 `forumPostDetail.ts` 补充 Mermaid 示例数据 | ✅ 完成 | `feat(diagram): add Mermaid diagram rendering to post content` — `d33a08b` |
| Step 7 | 验证：dev server 启动、图表渲染、语法错误降级、构建通过 | ✅ 完成 | `549e133` — TypeScript检查通过，Vite构建通过，dev server运行正常，ref挂载bug已修复 |

> **deferred（本期不做）**：Step 5（KrokiDiagram.vue / PlantUML 渲染），保留在 plan.md 供后续参考。
