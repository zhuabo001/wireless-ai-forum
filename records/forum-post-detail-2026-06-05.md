# 论坛帖子详情页 Vue 工程化转换 — 摘要

**日期**: 2026-06-05  
**开发计划**: `docs/plans/forum-post-detail-plan.md`  
**Commits**: `412ffc3`, `655e5cd`, `ae98c11`, `4b396d4`

## 功能概述

将 `page-design/forum-post-detail/forum-post-detail.html`（697行）转换为 Vue 3 + TypeScript 帖子详情页，保留文章正文、浮动操作栏、评论区全部视觉。废弃 contenteditable + execCommand，改用 wangEditor。点赞、收藏、评论交互全部由 Vue 状态驱动。

## 技术方案

- **文章正文**：ContentBlock 类型数组 + 类型驱动渲染器
- **评论编辑器**：wangEditor（主编辑器 + 内联回复编辑器）
- **浮动操作栏**：PostFloatingActions（桌面）和 PostMobileActions（移动）共享 Index.vue 状态
- **状态管理**：全部在 Index.vue 用 ref 管理，无需 Pinia
- **路由**：`/forum/post/:id`，从论坛列表 TopicItem 点击进入

## 修改文件清单

| 文件 | 变更说明 | 是否影响其他模块 |
|------|---------|----------------|
| `src/types/pageDesign/forumPostDetail.ts` | 新增：PostAuthor/PostDetail/ContentBlock/Comment/Reply 等类型定义 | 否 |
| `src/data/pageDesign/forumPostDetail.ts` | 新增：帖子详情、正文块、资源链接、评论等结构化数据 | 否 |
| `src/pages/forum-post-detail/Index.vue` | 新增：页面入口，状态管理 + 编排 11 个子组件 | 否 |
| `src/pages/forum-post-detail/PostHeader.vue` | 新增：返回导航/分类标签/标题/作者/统计信息 | 否 |
| `src/pages/forum-post-detail/PostContent.vue` | 新增：类型驱动的文章正文渲染器 + prose 样式 | 否 |
| `src/pages/forum-post-detail/PostResourceLinks.vue` | 新增：资源链接（GitHub/文档等） | 否 |
| `src/pages/forum-post-detail/PostFloatingActions.vue` | 新增：桌面浮动操作栏（点赞/评论/收藏）+ 动画 | 否 |
| `src/pages/forum-post-detail/PostMobileActions.vue` | 新增：移动端底部操作栏 + 动画 | 否 |
| `src/pages/forum-post-detail/CommentSection.vue` | 新增：评论区容器（组合排序/编辑器/列表） | 否 |
| `src/pages/forum-post-detail/CommentSortSelect.vue` | 新增：ElSelect 评论排序 | 否 |
| `src/pages/forum-post-detail/CommentEditor.vue` | 新增：wangEditor 主评论编辑器 | 否 |
| `src/pages/forum-post-detail/CommentItem.vue` | 新增：单条评论（含回复编辑器/嵌套回复） | 否 |
| `src/pages/forum-post-detail/CommentList.vue` | 新增：评论列表 + 加载更多 | 否 |
| `src/components/ui/IconRenderer.vue` | 修改：添加 Bookmark 图标导入和映射 | 否（仅新增条目） |
| `src/router/index.ts` | 修改：添加 `/forum/post/:id` 懒加载路由 | 否（仅新增路由） |
| `src/pages/forum/ForumTopicItem.vue` | 修改：添加 @click 导航至帖子详情页 | 否（仅添加 click 行为） |

## 对其他模块的影响

无破坏性影响。仅新增独立页面和路由，ForumTopicItem 仅添加 click 事件，不改变现有功能和样式。

## 验证结果

- TypeScript 编译通过
- Vite 构建通过
- 验证 Agent 检查：0 FAIL, 38 PASS, 4 WARNING（已修复3个实际问题）
- 论坛列表点击后正确跳转至 `/forum/post/1`
- 返回按钮正确返回 `/forum`
