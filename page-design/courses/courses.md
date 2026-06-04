# courses.html Vue 工程化转换方案

## 转换目标

- 只将 `courses.html` 转换为 Vue 工程页面，不调整当前设计方向。
- 保留课程中心的顶部导航、页面标题、左侧筛选栏、课程卡片网格和分页区。
- 原 HTML 中的课程文案、标签、讲师、难度、来源、学习人数等全部迁移为结构化数据。
- CDN Tailwind 和 CDN lucide 改为项目 npm 依赖与本地样式体系。

## 推荐文件结构

- `src/pages/CoursesPage.vue`：课程页面入口。
- `src/data/pageDesign/courses.ts`：课程列表、筛选分组、分页配置、页面文案。
- `src/types/pageDesign/courses.ts`：课程、筛选项、分页类型定义。
- `src/components/page-design/courses/CourseFilters.vue`：左侧课程分类、来源、难度筛选。
- `src/components/page-design/courses/CourseFilterGroup.vue`：单个筛选分组。
- `src/components/page-design/courses/CourseGrid.vue`：课程卡片网格。
- `src/components/page-design/courses/CourseCard.vue`：课程卡片。
- `src/components/page-design/courses/CoursePagination.vue`：分页区域。

## 结构化数据

建议拆为：

- `pageMeta`：标题、副标题、主按钮文案。
- `filterGroups`：分组标题、分组选项、图标、默认选中值。
- `courseItems`：课程标题、摘要、封面/图标、讲师、来源、难度、时长、学习人数、标签、状态。
- `pagination`：当前页、每页数量、总数、页码文案。

数据应支持后续真实接口替换，例如：

```ts
export interface CourseItem {
  id: string
  title: string
  summary: string
  source: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  learners: number
  tags: string[]
}
```

## Element Plus 替换点

- 分页建议使用 `ElPagination`，通过 small 模式和 CSS override 贴近原页按钮式分页。
- 左侧筛选可用 `ElCollapse` 承载分组，但分组标题和选项样式保留原 class。
- 如果筛选是单选语义，可用 `ElRadioGroup`；如果后续允许多选，可用 `ElCheckboxGroup`。
- 课程标签可使用 `ElTag`，但需要保持原页面的浅色 pill 视觉。
- 操作按钮可使用 `ElButton`，继续叠加原 Tailwind class。

## 不建议替换的区域

- 课程卡片不建议直接使用 `ElCard`，现有卡片的封面区域、hover 状态和信息密度更适合保留原 HTML 结构。
- 网格布局不建议使用 Element Plus layout 组件，直接保留 CSS grid 更接近原稿。
- 图标不在组件内散落导入，统一走 `IconRenderer`。

## TypeScript 逻辑

- `selectedFilters` 用对象记录每个 filter group 的当前值。
- `filteredCourses` 用 `computed` 根据筛选条件派生。
- `currentPage`、`pageSize` 用 `ref` 管理，`pagedCourses` 由 `computed` 输出。
- 课程卡片点击、收藏、开始学习等事件先以 emit 打桩，不写 DOM 事件字符串。

## 验收标准

- 与 `courses.html` 对比，左侧筛选、课程卡片网格和分页的位置、间距、颜色保持一致。
- 课程内容不硬编码在 template 中。
- 分页、筛选由 Vue 状态控制。
- 页面无外部 CDN 依赖。

