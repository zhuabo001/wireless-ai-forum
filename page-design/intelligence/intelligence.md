# intelligence.html Vue 工程化转换方案

## 转换目标

- 目标是把现有 `intelligence.html` 原样转换为 Vue 页面，不重新设计视觉。
- 保留当前导航、页面标题、左侧筛选栏、搜索区、情报列表卡片和“加载更多”按钮的布局密度与 Tailwind class。
- 删除 `cdn.tailwindcss.com`、`unpkg lucide` 和内联 `tailwind.config`，改用项目内 Tailwind 配置、全局 token、npm 图标包或现有 `IconRenderer`。
- 页面静态文案与列表内容迁移到结构化数据文件，Vue template 只负责消费数据。

## 推荐文件结构

- `src/pages/IntelligencePage.vue`：页面容器，组装筛选栏和列表区域。
- `src/data/pageDesign/intelligence.ts`：页面标题、副标题、分类、时间范围、情报卡片、按钮文案。
- `src/types/pageDesign/intelligence.ts`：`IntelligenceCategory`、`TimeRangeOption`、`IntelligenceItem` 等类型。
- `src/components/page-design/common/PageShell.vue`：复用顶部导航和页面背景。
- `src/components/page-design/common/PageHeader.vue`：复用标题、说明、主操作按钮区域。
- `src/components/page-design/intelligence/IntelligenceSidebar.vue`：左侧分类和时间筛选。
- `src/components/page-design/intelligence/IntelligenceSearch.vue`：搜索输入与排序/操作区。
- `src/components/page-design/intelligence/IntelligenceList.vue`：列表容器。
- `src/components/page-design/intelligence/IntelligenceCard.vue`：单条情报卡片。

## 结构化数据

建议将硬编码内容整理为：

- `pageMeta`：`title`、`description`、`primaryAction`。
- `categoryFilters`：分类 id、名称、图标名、数量、是否默认选中。
- `timeFilters`：时间范围 id、名称、数量或说明。
- `intelligenceItems`：标题、摘要、标签、来源、时间、分类、图标、图标颜色、外链状态。
- `searchConfig`：placeholder、默认关键字、空状态文案。

数据示例形态：

```ts
export const intelligenceItems: IntelligenceItem[] = [
  {
    id: 'openai-o3-pro',
    title: '...',
    summary: '...',
    source: '...',
    publishedAt: '...',
    categoryId: 'model',
    icon: 'brain',
    tags: ['大模型', '研发效率']
  }
]
```

## Element Plus 替换点

- 搜索框可使用 `ElInput`，通过 class 和 CSS override 保留原圆角、边框、阴影。
- “加载更多”可使用 `ElButton`，按钮视觉继续使用现有 class。
- 如果移动端需要把左侧筛选折叠，可使用 `ElDrawer`，桌面端仍保留原侧栏。
- 标签可使用 `ElTag`，但需要覆盖背景色、边框和字体大小，避免破坏当前轻量 pill 样式。

## 不建议替换的区域

- 情报卡片主体不建议整体替换成 Element Plus `ElCard`，因为当前卡片 hover、图标块、信息层级依赖现有 HTML 结构。
- 左侧筛选项不建议强行换成 `ElMenu`，原页面是轻量筛选列表，`ElMenu` 默认交互和间距会改变视觉。
- 顶部导航应复用首页已沉淀的导航组件或局部复刻，不用 Element Plus `ElHeader` 重构。

## TypeScript 逻辑

- `selectedCategoryId`、`selectedTimeRangeId`、`keyword` 使用 `ref`。
- `filteredItems` 使用 `computed` 从结构化数据派生。
- “加载更多”只维护 `visibleCount`，不直接操作 DOM。
- 图标通过 `IconRenderer` 的 icon name 映射，不在业务组件直接导入 lucide。

## 验收标准

- 页面首屏与 `intelligence.html` 视觉一致，尤其是左栏宽度、列表卡片间距、标题层级。
- Vue template 中不出现长段硬编码情报标题、摘要和筛选项。
- 页面不再包含 CDN script/link。
- 搜索、分类筛选、时间筛选可以由 Vue 响应式状态驱动。

