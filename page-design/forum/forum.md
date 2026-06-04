# forum.html Vue 工程化转换方案

## 转换目标

- 将 `forum.html` 转换为 Vue 页面组件，保持 AI 论坛列表页原始视觉。
- 保留导航、页面标题、发起话题按钮、分类 tab、筛选下拉、搜索框、话题列表、分页和右侧社区侧栏。
- 论坛话题、热帖排行、活跃用户、热门标签、社区规范全部抽为结构化 mock 数据。
- 页面交互用 Vue/TypeScript 实现，不保留 HTML 字符串事件。

## 推荐文件结构

- `src/pages/ForumPage.vue`：论坛列表页入口。
- `src/data/pageDesign/forum.ts`：tab、筛选项、话题列表、侧栏数据、页面文案。
- `src/types/pageDesign/forum.ts`：话题、作者、统计、侧栏榜单类型。
- `src/components/page-design/forum/ForumToolbar.vue`：tab、筛选 select、搜索输入。
- `src/components/page-design/forum/ForumTopicList.vue`：话题列表。
- `src/components/page-design/forum/ForumTopicItem.vue`：单条话题。
- `src/components/page-design/forum/ForumPagination.vue`：分页。
- `src/components/page-design/forum/ForumSidebar.vue`：右侧栏容器。
- `src/components/page-design/forum/HotTopicRank.vue`：热帖排行。
- `src/components/page-design/forum/ActiveUserList.vue`：活跃用户。
- `src/components/page-design/forum/HotTagCloud.vue`：热门标签。
- `src/components/page-design/forum/CommunityRules.vue`：社区规范。

## 结构化数据

建议拆为：

- `pageMeta`：标题、描述、发起话题按钮。
- `forumTabs`：全部、热门、最新、问答等 tab。
- `filterOptions`：分类、排序、时间范围。
- `topicItems`：标题、摘要、作者、团队、发布时间、标签、回复数、浏览数、点赞数、是否置顶/热门。
- `sidebar.hotTopics`：排行名、热度、跳转地址。
- `sidebar.activeUsers`：用户、头像、团队、积分、徽章。
- `sidebar.hotTags`：标签名、数量、颜色。
- `sidebar.rules`：规范文案列表。

## Element Plus 替换点

- 分类 tab 可用 `ElTabs` 或 `ElSegmented`。若默认样式影响过大，保留自定义按钮组更稳。
- 筛选下拉使用 `ElSelect`。
- 搜索框使用 `ElInput`。
- 发起话题、分页按钮使用 `ElButton` 或 `ElPagination`。
- 话题标签用 `ElTag`，用户头像用 `ElAvatar`。

## 不建议替换的区域

- 话题列表项不建议使用 `ElCard`，因为原页面是紧凑内容列表，默认卡片边距会改变信息密度。
- 右侧社区规范不建议使用 `ElAlert`，原视觉是普通说明卡片。
- 热帖排行不建议使用 `ElTable`，当前排行是轻列表。

## TypeScript 逻辑

- `activeTab`、`selectedCategory`、`selectedSort`、`keyword`、`currentPage` 使用 `ref`。
- `filteredTopics` 从 tab、筛选项和搜索词派生。
- `pagedTopics` 处理分页。
- 发起话题按钮跳转到 `forum-new-topic` 路由或 emit 打桩。

## 验收标准

- 论坛列表页主栏与右侧栏比例保持原样。
- 话题、榜单、标签和规则均来自数据文件。
- 下拉、搜索、分页由 Vue 状态驱动。
- 无 CDN 和内联脚本。

