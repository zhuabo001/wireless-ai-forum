# 论坛帖子正文 Mermaid 图表渲染 — 开发记录

**日期**: 2026-07-04  
**功能**: 论坛帖子详情页正文支持 Mermaid 图表渲染（PlantUML deferred）

## 问题背景

`PostContent.vue` 将 markdown 中的 mermaid 代码块按普通 `code` 类型渲染为 `<pre><code>`，导致图表源码以纯文本形式展示，而非图形化的流程图/时序图。

## 修改文件清单

| # | 文件 | 操作 | 说明 |
|---|------|------|------|
| 1 | `src/types/pageDesign/forumPostDetail.ts` | 修改 | 新增 `'diagram'` ContentBlockType、`DiagramEngine` 类型、`ContentBlock` 新增 `engine`/`source` 字段 |
| 2 | `package.json` / `package-lock.json` | 修改 | 安装 `mermaid@11.16.0`（精确版本，无 `^/~` 范围） |
| 3 | `src/pages/forum-post-detail/DiagramBlock.vue` | 新建 | 图表分发组件，按 `engine` 字段路由到对应渲染器 |
| 4 | `src/pages/forum-post-detail/MermaidDiagram.vue` | 新建 | Mermaid 客户端渲染组件，含 loading 态、错误降级、唯一 ID |
| 5 | `src/pages/forum-post-detail/PostContent.vue` | 修改 | 新增 diagram 分支 + 图表容器样式 |
| 6 | `src/data/pageDesign/forumPostDetail.ts` | 修改 | 补充 1 条 Mermaid 流程图示例 + 1 条 PlantUML 降级示例 |
| 7 | `docs/forum-post-content-diagram-rendering-plan.md` | 新建 | 开发计划文档 |
| 8 | `docs/forum-post-content-diagram-rendering-plan-progress.md` | 新建 | 任务进度面板 |

## 对其他模块的影响

- **`PostContent.vue`**：仅在 `v-for` 分支中新增一条 `v-else-if`，不影响已有 `paragraph`/`heading`/`list`/`code`/`blockquote`/`table` 类型的渲染。已有样式均未修改。
- **类型系统**：`ContentBlockType` 新增 `'diagram'`，`ContentBlock` 新增两个**可选**字段 `engine?` 和 `source?`，向后兼容，不会破坏现有数据。
- **依赖**：新增 `mermaid@11.16.0`（约 109 个传递依赖），mermaid 自身约 1MB+ gzipped 后约 350KB。由于使用 `import()` 动态加载，不影响首屏加载体积（仅在帖子详情页按需加载）。
- **其他页面**：无影响。forum / practices / toolbox / new-topic 等页面不引用新增组件。

## 验证结果

- TypeScript 编译：✅ 通过（vue-tsc）
- Vite 生产构建：✅ 通过（npm run build）
- 6/6 plan 步骤（deferred 除外）全部完成
- 对抗性检查：未知引擎降级、语法错误降级、多实例 ID 隔离、动态 import 失败、空 source/engine 守卫 —— 全部通过

## Commit 记录

| Commit Hash | 说明 |
|-------------|------|
| `63f9bfa` | feat(types): add 'diagram' ContentBlockType, DiagramEngine type |
| `92f4188` | feat(deps): install mermaid@11.16.0 |
| `d33a08b` | feat(diagram): add Mermaid diagram rendering to post content |
| `549e133` | fix(diagram): use v-show instead of v-else for ref availability |
| `005a2a8` | fix(data): add PlantUML sample diagram block |

## 待后续迭代

- PlantUML 渲染（`KrokiDiagram.vue`），需确认数据外发策略后再实现
