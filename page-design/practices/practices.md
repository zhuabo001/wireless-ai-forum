# practices.html Vue 工程化转换方案

## 转换目标

- 将 `practices.html` 转为 Vue 页面组件，保留“优秀实践”当前视觉。
- 保留顶部导航、页面标题、发布实践按钮、左侧实践分类、主列表、分页和右侧信息栏。
- 所有实践文章、分类、热帖、贡献者、团队信息都迁移到结构化 mock 数据。
- 原页面中 lucide 图标改为 npm 包或既有 `IconRenderer` 映射。

## 推荐文件结构

- `src/pages/PracticesPage.vue`：页面入口。
- `src/data/pageDesign/practices.ts`：实践列表、分类树、侧栏榜单、页面文案。
- `src/types/pageDesign/practices.ts`：实践项、分类项、榜单项、团队项类型。
- `src/components/page-design/practices/PracticeCategorySidebar.vue`：左侧分类。
- `src/components/page-design/practices/PracticeToolbar.vue`：筛选按钮与列表辅助操作。
- `src/components/page-design/practices/PracticeList.vue`：实践列表。
- `src/components/page-design/practices/PracticeCard.vue`：单条实践卡片。
- `src/components/page-design/practices/PracticeSidebar.vue`：右侧栏容器。
- `src/components/page-design/practices/HotPostList.vue`：今日热帖。
- `src/components/page-design/practices/ContributorList.vue`：热门贡献者。
- `src/components/page-design/practices/TeamList.vue`：热门团队。

## 结构化数据

建议拆为：

- `pageMeta`：标题、描述、发布按钮。
- `practiceCategories`：分类 id、名称、图标、子分类、数量、默认展开状态。
- `practiceItems`：标题、摘要、作者、团队、日期、浏览量、标签、分类、置顶/精选状态。
- `sidebar.hotPosts`：排行标题、热度、链接。
- `sidebar.contributors`：姓名、头像文字、团队、积分/贡献数、奖牌等级。
- `sidebar.teams`：团队名、贡献数、趋势信息。

## Element Plus 替换点

- 左侧分类如果需要真实展开/收起，可以用 `ElCollapse` 或 `ElTree`。若优先保视觉，建议自定义结构加 Vue 状态。
- 筛选按钮、发布实践按钮可用 `ElButton`。
- 分页可用 `ElPagination`，样式覆盖为原来的小型按钮组视觉。
- 标签可使用 `ElTag`。
- 贡献者头像如果没有图片，可用 `ElAvatar` 显示文字头像。

## 不建议替换的区域

- 主实践列表卡片不建议替换为 `ElCard`，因为当前卡片是文章列表形态，不是标准卡片容器。
- 右侧榜单卡片的内部排版不建议用 Element Plus 表格或列表组件替换，保留原 HTML 更稳定。
- 分类图标颜色和间距应沿用原 class，不使用 Element Plus 默认菜单样式。

## TypeScript 逻辑

- `expandedCategoryIds` 控制分类展开。
- `selectedCategoryId`、`selectedSort`、`currentPage` 管理筛选分页。
- `filteredPracticeItems` 与 `pagedPracticeItems` 使用 `computed`。
- 发布实践按钮先 emit 或路由跳转打桩，不引入无关业务。

## 验收标准

- 三栏布局、右侧卡片堆叠、列表行高与原 HTML 保持一致。
- 文章、热帖、贡献者、团队信息都来自数据文件。
- 无内联 CDN 脚本。
- 分类展开、筛选、分页状态由 Vue 控制。

