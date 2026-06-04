# toolbox.html Vue 工程化转换方案

## 转换目标

- 将 `toolbox.html` 转为 Vue 页面，不改变“百宝箱”现有样式。
- 保留左侧工具分类、主搜索区、排序按钮、文章列表和分页。
- 工具分类、文章标题、摘要、标签、阅读数据全部结构化。
- 删除 CDN Tailwind、CDN lucide 和页面末尾 `lucide.createIcons()`。

## 推荐文件结构

- `src/pages/ToolboxPage.vue`：百宝箱页面入口。
- `src/data/pageDesign/toolbox.ts`：工具分类、文章列表、搜索配置、分页配置。
- `src/types/pageDesign/toolbox.ts`：工具分类、文章、排序项类型。
- `src/components/page-design/toolbox/ToolCategorySidebar.vue`：左侧智能体工具分类。
- `src/components/page-design/toolbox/ToolCategoryItem.vue`：单个工具分类项。
- `src/components/page-design/toolbox/ToolboxSearchBar.vue`：搜索输入、搜索按钮、排序按钮。
- `src/components/page-design/toolbox/ToolArticleList.vue`：文章列表。
- `src/components/page-design/toolbox/ToolArticleItem.vue`：单篇文章。
- `src/components/page-design/toolbox/ToolboxPagination.vue`：分页区域。

## 结构化数据

建议包括：

- `pageMeta`：标题、说明、提交手册按钮。
- `toolCategories`：id、名称、描述、图标、颜色、数量、是否选中。
- `articleItems`：标题、摘要、工具分类、作者/团队、日期、阅读量、标签。
- `sortOptions`：最新、最热、推荐等。
- `searchConfig`：placeholder、按钮文案、空状态文案。

## Element Plus 替换点

- 搜索框使用 `ElInput`，prefix icon 使用 Element Plus icon 或 `IconRenderer` slot。
- 搜索、提交手册、排序按钮可用 `ElButton`。
- 排序如果后续有更多选项，可用 `ElDropdown`；当前只有单按钮时不必强行复杂化。
- 分页可用 `ElPagination`。
- 标签可用 `ElTag`。

## 不建议替换的区域

- 左侧工具分类卡片不建议用 `ElMenu`，当前分类项更像功能卡片，Element Plus 菜单会破坏间距和选中态。
- 文章列表不建议用 `ElTable`，原页面是内容列表而不是表格。
- 卡片外层视觉保留原 div 和 Tailwind class，不整体换成 `ElCard`。

## TypeScript 逻辑

- `selectedToolId`、`keyword`、`sortKey`、`currentPage` 使用 `ref`。
- `filteredArticles` 根据工具分类和关键字计算。
- `pagedArticles` 根据分页计算。
- 工具分类点击通过组件 emit 更新选中状态。

## 验收标准

- 左侧分类、搜索栏、文章列表和分页视觉与原 HTML 一致。
- 静态文章内容不硬编码在 Vue template。
- 搜索和分类筛选可以用响应式状态驱动。
- 无外部 CDN 依赖。

