# forum-post-detail.html Vue 工程化转换方案

## 转换目标

- 将 `forum-post-detail.html` 转换为 Vue 帖子详情页，保留当前文章详情、浮动操作栏、评论区和移动端底部操作栏视觉。
- 原 HTML 中的帖子正文、作者信息、统计数据、资源链接、评论树全部迁移为结构化数据。
- 评论编辑器和回复编辑器使用 wangEditor Vue3 组件，不再使用 contenteditable 和 `document.execCommand`。
- 点赞、收藏、评论、回复显示隐藏全部由 Vue/TypeScript 状态驱动。

## 推荐 npm 依赖

- 富文本评论编辑器：`@wangeditor/editor`、`@wangeditor/editor-for-vue@next`。
- 页面交互组件：继续使用 `element-plus`。
- 图标：使用项目内 `IconRenderer` 或 npm 图标 facade。

## 推荐文件结构

- `src/pages/ForumPostDetailPage.vue`：详情页入口。
- `src/data/pageDesign/forumPostDetail.ts`：帖子详情、作者、正文块、资源链接、评论、排序选项。
- `src/types/pageDesign/forumPostDetail.ts`：帖子、评论、回复、操作状态类型。
- `src/components/page-design/forum-post-detail/PostFloatingActions.vue`：桌面左侧浮动操作栏。
- `src/components/page-design/forum-post-detail/PostMobileActions.vue`：移动端底部操作栏。
- `src/components/page-design/forum-post-detail/PostHeader.vue`：返回、分类、标题、作者、统计信息。
- `src/components/page-design/forum-post-detail/PostContent.vue`：正文内容。
- `src/components/page-design/forum-post-detail/PostResourceLinks.vue`：GitHub、文档等资源链接。
- `src/components/page-design/forum-post-detail/CommentSection.vue`：评论区容器。
- `src/components/page-design/forum-post-detail/CommentSortSelect.vue`：评论排序。
- `src/components/page-design/forum-post-detail/CommentEditor.vue`：主评论编辑器。
- `src/components/page-design/forum-post-detail/CommentList.vue`：评论列表。
- `src/components/page-design/forum-post-detail/CommentItem.vue`：单条评论及其回复。
- `src/components/page-design/forum-post-detail/ReplyEditor.vue`：回复编辑器。

## 结构化数据

建议包括：

- `postDetail`：标题、分类、标签、作者、发布时间、阅读量、评论数、点赞数、收藏数。
- `postContentBlocks`：正文段落、标题、列表、代码块、引用块。也可临时保留 sanitized HTML 字符串，但应集中在数据文件。
- `resourceLinks`：类型、标题、图标、链接。
- `actionConfig`：点赞、评论、收藏按钮文案和图标。
- `commentSortOptions`：最新、最热等。
- `comments`：评论 id、作者、内容 HTML、时间、点赞数、是否已点赞、回复列表。

如果正文短期内必须保留富 HTML，建议放在 `forumPostDetail.ts`，并通过可信内容渲染组件集中处理，避免散落在 template。

## Element Plus 替换点

- 评论排序使用 `ElSelect`。
- 点赞、评论、收藏、发布、取消、加载更多等按钮使用 `ElButton`。
- 标签使用 `ElTag`。
- 作者和评论头像可使用 `ElAvatar`。
- 操作按钮 hover 提示可使用 `ElTooltip`。
- 发布反馈使用 `ElMessage`。

## 脚本迁移为 TypeScript

原脚本转换为组合式逻辑：

- `usePostActions.ts`：维护 `liked`、`bookmarked`、点赞数、收藏数。
- `useScrollToComments.ts`：通过 Vue `ref` 滚动到评论区。
- `useCommentTree.ts`：管理评论点赞、回复框展开、回复提交、加载更多。
- `useCommentEditor.ts`：封装 wangEditor 的创建、销毁、内容 v-model 和清空。

需要删除或替代：

- `toggleLike()`、`toggleBookmark()` 改为响应式 action。
- `scrollToComments()` 改为 `commentsRef.value?.scrollIntoView()`。
- `toggleCommentLike(btn)` 改为按 comment id 更新数据。
- `toggleReply(commentId)` 改为 `activeReplyCommentId` 或 `expandedReplyIds`。
- `execCmd()`、`insertCode()` 由 wangEditor toolbar 接管。
- `submitMainComment()`、`submitReply(commentId)` 改为表单提交方法，操作结构化评论数据。

## 不建议替换的区域

- 文章正文排版不建议用 Element Plus 组件替换，保留 `prose` 风格和现有段落/代码块 class。
- 左侧浮动操作栏和移动端底栏不建议用 Element Plus layout 重排，只替换按钮内核或保持自定义按钮。
- 评论列表不建议用 `ElTree`，当前评论嵌套结构和信息密度需要保留原 HTML。

## 验收标准

- 桌面浮动操作栏、移动端底部操作栏、文章正文和评论区视觉与原 HTML 一致。
- 帖子正文、资源链接、评论数据不硬编码在 template。
- 评论编辑器和回复编辑器可通过 v-model 管理内容，并在组件卸载时销毁编辑器实例。
- 无 CDN、无内联脚本、无 `document.execCommand`。

