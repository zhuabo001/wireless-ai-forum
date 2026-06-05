# Forum Page Vue 工程化转换 — 开发计划

## Context

将 `page-design/forum/forum.html`（352行）转换为 Vue 3 + TypeScript 论坛列表页。原始 HTML 包含：页面标题、"发起话题"按钮、6个分类 Tab、筛选下拉、搜索框、6条话题列表、分页、右侧栏（热帖排行/活跃用户/热门标签/社区规范）。当前项目无任何论坛页面实现，需从零搭建。

## 文件清单（12个文件）

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/types/pageDesign/forum.ts` | 类型定义 |
| 2 | `src/data/pageDesign/forum.ts` | 结构化 mock 数据 |
| 3 | `src/pages/forum/CommunityRules.vue` | 社区规范组件 |
| 4 | `src/pages/forum/HotTagCloud.vue` | 热门标签组件 |
| 5 | `src/pages/forum/ActiveUserList.vue` | 活跃用户组件 |
| 6 | `src/pages/forum/HotTopicRank.vue` | 热帖排行组件 |
| 7 | `src/pages/forum/ForumSidebar.vue` | 右侧栏容器（聚合以上4个组件） |
| 8 | `src/pages/forum/ForumTopicItem.vue` | 单条话题行 |
| 9 | `src/pages/forum/ForumTopicList.vue` | 话题列表容器 |
| 10 | `src/pages/forum/ForumPagination.vue` | 分页组件 |
| 11 | `src/pages/forum/ForumToolbar.vue` | Tab导航 + 筛选 + 搜索 |
| 12 | `src/pages/forum/Index.vue` | 页面入口（状态管理 + 布局编排） |
| 修改 | `src/router/index.ts` | 添加 `/forum` 路由 |

## 实施步骤

### Step 1: 类型定义 — `src/types/pageDesign/forum.ts`

定义以下接口：

- **ForumTab** — `{ id: string, name: string }`
- **ForumFilterOption** — `{ id: string, name: string }`
- **TopicAuthor** — `{ name, initials, gradientFrom, gradientTo }`
- **TopicItem** — `{ id, author: TopicAuthor, categoryBadge, tagBadge, title, time, replies: number, views: string, likes: number }`
- **HotTopic** — `{ rank: number, title, rankColor, flameColor }`
- **ActiveUser** — `{ name, initials, gradientFrom, gradientTo, weeklyPosts: number, medalColor?: string }`
- **HotTag** — `{ name, bgClass, textClass }`
- **ForumRule** — `{ content: string }`
- **ForumPageMeta** — `{ title, description, createButtonText }`
- **ForumSidebarData** — `{ hotTopics, activeUsers, hotTags, rules }`
- **PaginationConfig** — `{ pageSize: number }`

### Step 2: 数据文件 — `src/data/pageDesign/forum.ts`

从 HTML 中提取所有结构化数据：

- **forumMeta**: 标题"AI论坛"，描述"用户交流广场，任何问题讨论和话题交流都可以在这里发起"，按钮文字"发起话题"
- **forumTabs**: 6个Tab（全部/热门/工具FAQ/技术探讨/业界趋势/工程能力全景）
- **categoryFilterOptions**: 3个（全部帖子/我的回复/我的发帖）
- **sortFilterOptions**: 3个（最新发布/最高热度/最新回复）
- **topicItems**: 6条话题，包含作者信息（姓名/首字母/渐变色）、分类徽章、标签徽章、标题、时间、回复数/浏览数/点赞数
- **sidebarData**: 热帖排行5条、活跃用户5人、热门标签8个、社区规范4条
- **defaultTabId**: `'all'`
- **paginationConfig**: `{ pageSize: 6 }`

### Step 3-6: 侧边栏子组件（由简到繁）

**CommunityRules.vue** — Props: `rules: ForumRule[]`。白色卡片 + "社区规范"标题 + 列表循环（check-circle 图标 + 文本）。

**HotTagCloud.vue** — Props: `tags: HotTag[]`。白色卡片 + "热门标签"标题 + flex-wrap 标签云，每个标签使用数据中的 `bgClass`/`textClass`。

**ActiveUserList.vue** — Props: `users: ActiveUser[]`。白色卡片 + "活跃用户"标题 + 用户行列表（渐变头像8x8 + 姓名 + 本周发帖数 + medal图标，仅 top3 显示奖牌）。

**HotTopicRank.vue** — Props: `topics: HotTopic[]`。白色卡片 + flame图标 + "热帖排行"标题 + 排行链接列表（序号 + flame图标 + 标题，line-clamp-2）。

### Step 7: 侧边栏容器 — `ForumSidebar.vue`

Props: `sidebarData: ForumSidebarData`。`sticky top-24 space-y-6` 容器，组合以上4个子组件。

### Step 8-9: 话题列表组件

**ForumTopicItem.vue** — Props: `topic: TopicItem`。单行布局：
- 左侧：渐变圆形头像（40x40，首字母）
- 中间：分类徽章（blue-50/blue-600）+ 标签徽章（gray-100/gray-600）+ 标题（truncate）+ 作者·时间
- 右侧（sm+可见）：回复数/浏览数/点赞数 + lucide 图标

**ForumTopicList.vue** — Props: `topics: TopicItem[]`。白色圆角卡片容器，v-for 渲染 ForumTopicItem，最后一项不加 border-b。

### Step 10: 分页 — `ForumPagination.vue`

Props: `currentPage: number, totalPages: number`。Emits: `'update:currentPage': [page: number]`。

参考 `CoursePagination.vue` 模式：上一页/下一页按钮 + 页码按钮 + 省略号。使用 computed 生成页码数组，当前页高亮（bg-primary text-white）。

### Step 11: 工具栏 — `ForumToolbar.vue`

Props: `activeTab, selectedCategory, selectedSort, keyword, tabs: ForumTab[], categoryOptions: ForumFilterOption[], sortOptions: ForumFilterOption[]`。

Emits: `'update:activeTab'/'update:selectedCategory'/'update:selectedSort'/'update:keyword'`。

两部分：
1. **Tab导航**：flex row + border 容器，每个 tab 为 button，active 状态白字蓝底，非 active 灰色文字 hover 效果
2. **筛选行**：原生 `<select>`（分类/排序）+ 搜索 `<input>`（带 search 图标前缀）

筛选控件使用原生元素 + Tailwind 样式而非 ElSelect，保持原始紧凑视觉。

### Step 12: 页面入口 — `src/pages/forum/Index.vue`

**状态管理**：
```typescript
const activeTab = ref<string>('all')
const selectedCategory = ref<string>('all')  
const selectedSort = ref<string>('latest')
const keyword = ref<string>('')
const currentPage = ref<number>(1)
```

**计算属性**：
- `filteredTopics`: 根据 activeTab（匹配 categoryBadge 或 "全部"/"热门"特殊处理）和 keyword（标题/作者模糊匹配）过滤
- `totalPages`: `Math.ceil(filteredTopics.length / pageSize)`
- `pagedTopics`: 当前页切片

**处理函数**（均带类型标注和返回值类型）：
- `onTabChange(tabId: string): void` — 切换 tab 并重置页码
- `onKeywordChange(value: string): void` — 搜索并重置页码
- `onPageChange(page: number): void` — 切换页码
- `onCreateTopic(): void` — 发起话题（暂用 console.log 打桩）

**布局**：`pt-16 > max-w-7xl > header > grid lg:grid-cols-12 > main(lg:col-span-8) + aside(lg:col-span-4)`，与 forum.html 比例一致。

### Step 13: 路由 — 修改 `src/router/index.ts`

在 routes 数组中添加：
```typescript
{
  path: '/forum',
  name: 'forum',
  component: () => import('@/pages/forum/Index.vue'),
}
```

## 关键设计决策

1. **组件位置**：放在 `src/pages/forum/` 而非 `src/components/page-design/forum/`，遵循 html-convert-to-vue.md 规则和现有页面惯例
2. **筛选控件**：使用原生 `<select>` + Tailwind 而非 ElSelect，保持原始紧凑视觉
3. **分页**：自定义分页组件而非 ElPagination，匹配原始按钮样式
4. **状态管理**：全部在 Index.vue 中用 ref/computed 管理，不引入 Pinia store（无跨页面共享需求）
5. **侧边栏数据**：聚合为 `ForumSidebarData` 单一 prop 传递，保持 Index.vue 模板简洁

## 可复用组件

- `src/components/ui/IconRenderer.vue` — 渲染 lucide 图标
- `src/components/ui/TagBadge.vue` — 渲染分类/标签徽章

## 验证步骤

1. 启动 dev server，访问 `/forum` 路由
2. 逐区域比对原始 HTML 视觉：页面标题、Tab导航、筛选行、话题列表、分页、右侧栏四个模块
3. 交互验证：点击各 Tab 过滤、输入搜索词、切换页码
4. 确认无 CDN 引用（tailwindcss CDN、lucide CDN）
5. TypeScript 检查：所有函数参数和返回值有类型标注，无隐式 any
6. 响应式：sm 断点下统计列隐藏，移动端布局正常
