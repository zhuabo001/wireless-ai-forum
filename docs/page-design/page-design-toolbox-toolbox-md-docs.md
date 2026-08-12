# 百宝箱页面（ToolboxPage）Vue 工程化转换计划

## 背景

将 `page-design/toolbox/toolbox.html`（220行，两栏布局：左侧工具分类 + 右侧文章列表+分页）转为 Vue 工程化页面。包含左侧6个工具分类卡片、搜索栏+搜索按钮+排序按钮、文章列表（含作者信息）、传统分页组件、"提交手册"按钮。

**前置验证**：所需 lucide 图标中，`file-text`、`git-merge`、`terminal`、`search`、`shield-check`、`chevron-left`、`chevron-right` 已存在。需新增 3 个图标：`bug`、`arrow-down-up`、`file-plus-2`。

**参考实现**：`src/pages/intelligence/`。

**规则约束**：遵循 `page-design/rules/html-convert-to-vue.md`，子组件放在 `src/pages/toolbox/` 下。

**关键差异（与 intelligence 页面对比）**：
- 使用**传统分页**（非"加载更多"），需 currentPage + pageSize + totalPages 计算
- 排序按钮（最新/最热/推荐切换）
- 分类卡片无"全部"选项，第一个分类默认选中
- 文章卡片含作者信息（头像 img、姓名、发布日期）
- 无时间范围筛选、无分类颜色映射

## 实施步骤

### 步骤 1：新增缺失的 IconName 并注册图标

**文件**：`src/types/home.ts`

在 `IconName` 联合类型中追加 3 个新图标：

```typescript
| 'arrow-down-up'
| 'bug'
| 'file-plus-2'
```

**文件**：`src/components/ui/IconRenderer.vue`

在 `<script setup>` import 中追加：

```typescript
import { ArrowDownUp, Bug, FilePlus2 } from 'lucide-vue-next'
```

在 `iconMap` 中追加：

```typescript
'arrow-down-up': ArrowDownUp,
'bug': Bug,
'file-plus-2': FilePlus2,
```

### 步骤 2：创建 TypeScript 类型定义

**文件**：`src/types/pageDesign/toolbox.ts`

```typescript
import type { IconName } from '../home'

export interface ToolCategory {
  id: string       // 'debug' | 'doc-gen' | 'code-merge' | 'cli-tools' | 'smart-search' | 'security'
  name: string     // '调试助手' | '文档生成器' 等
  icon: IconName
  count: number    // 帖子数
}

export interface ToolArticle {
  id: string
  title: string
  summary: string
  categoryId: string
  author: string
  avatar: string       // 头像路径 '/avatar-1.webp'
  date: string         // '2026-05-28'
}

export interface SortOption {
  key: string          // 'latest' | 'popular' | 'recommended'
  label: string        // '最新' | '最热' | '推荐'
}

export interface ToolboxPageMeta {
  title: string
  description: string
}
```

### 步骤 3：创建结构化数据文件

**文件**：`src/data/pageDesign/toolbox.ts`

从 toolbox.html 提取所有硬编码数据：

- `toolboxMeta`：`{ title: '百宝箱', description: '面向智能体工具的使用手册、故障处理、配置示例和经验帖' }`
- `toolCategories`：6 个分类，含 id/name/icon/count：

| id | name | icon | count |
|----|------|------|-------|
| `debug` | 调试助手 | `bug` | 18 |
| `doc-gen` | 文档生成器 | `file-text` | 15 |
| `code-merge` | 代码合并助手 | `git-merge` | 12 |
| `cli-tools` | CLI工具集 | `terminal` | 22 |
| `smart-search` | 智能检索 | `search` | 20 |
| `security` | 安全扫描 | `shield-check` | 9 |

- `toolboxArticles`：5 篇文章（均属 debug 分类），含 id/title/summary/categoryId/author/avatar/date
- `sortOptions`：`[{ key:'latest', label:'最新' }, { key:'popular', label:'最热' }, { key:'recommended', label:'推荐' }]`
- `searchConfig`：`{ placeholder: '搜索标题、摘要或作者' }`
- `paginationConfig`：`{ pageSize: 8 }` — 用于计算 totalPages，HTML 中硬编码显示 8 页

### 步骤 4：创建子组件

所有组件放在 `src/pages/toolbox/` 下。

#### 4a. ToolCategorySidebar.vue
- Props: `categories: ToolCategory[]`, `selectedCategoryId: string`
- Emits: `update:selectedCategoryId [value: string]`
- 布局：`<aside class="hidden lg:block lg:col-span-3">` + `sticky top-24`
- 标题行："智能体工具" + "42 个"（硬编码） — 注：HTML 中写作 "42 个" 但总数实际 96，保留原文案
- 分类按钮网格：`grid sm:grid-cols-2 lg:grid-cols-1 gap-3`
- 每个分类卡片 `rounded-xl p-4 text-left`：
  - 选中态：`bg-primary text-white shadow-sm`，描述 `text-white/75`，图标 `opacity-90`
  - 未选中：`bg-white border border-border`，hover 时 `hover:shadow-md hover:-translate-y-0.5 transition-all`
- 卡片内容：`flex items-center justify-between` → 名称 + IconRenderer；下方描述 "X 篇帖子"
- 分类卡片较多（6个），不拆成子组件，直接在 v-for 内 inline

#### 4b. ToolboxSearchBar.vue
- Props: `keyword: string`, `placeholder: string`, `sortKey: string`, `sortOptions: SortOption[]`
- Emits: `update:keyword [value: string]`, `update:sortKey [value: string]`, `search []`
- 布局：白底圆角容器 `bg-white rounded-xl border border-border p-4`，内部 `flex flex-col sm:flex-row sm:items-center gap-3`
- 搜索输入框：原生 `<input>`，带 search 图标（绝对定位左侧），`:value="keyword"` + `@input` emit
- 搜索按钮：`bg-primary text-white`，"搜索" 文案 + search 图标，点击 emit `search`
- 排序按钮：切换当前 sortKey，显示对应 label + `arrow-down-up` 图标，`bg-white border border-border` 样式

#### 4c. ToolArticleItem.vue
- Props: `article: ToolArticle`
- 外层 `<article>` 卡片：`p-5 border-b border-border/60`（最后一项无 border-b），`hover:bg-gray-50 transition-colors cursor-pointer group`
- 标题：`text-base font-semibold`，`group-hover:text-primary transition-colors`
- 摘要：`text-sm text-muted-foreground line-clamp-2`（scoped CSS）
- 作者行：`flex items-center gap-2` → `<img>` 头像 `w-8 h-8 rounded-full` + 姓名 `text-sm font-medium` + 日期 `text-xs text-muted-foreground`（格式："发布日期：{date}"）

#### 4d. ToolArticleList.vue
- Props: `articles: ToolArticle[]`
- 外层容器：`bg-white rounded-xl border border-border overflow-hidden`
- v-for 渲染 `ToolArticleItem`，最后一项无 `border-b`
- 空状态：`v-if="articles.length === 0"` 显示 "没有找到匹配的文章"

#### 4e. ToolboxPagination.vue
- Props: `currentPage: number`, `totalPages: number`
- Emits: `update:currentPage [value: number]`
- 水平居中 `flex items-center justify-center gap-2 mt-6`
- 上一页按钮：`chevron-left` 图标，当 currentPage === 1 时 `opacity-50 pointer-events-none`
- 页码按钮：循环生成，当前页 `text-white bg-primary rounded-lg`，其他 `text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted`
- 省略号：当页码 gap > 1 时插入 `...`（纯展示，不可点击）
- 下一页按钮：`chevron-right` 图标，当 currentPage === totalPages 时禁用

### 步骤 5：创建页面入口 Index.vue

**文件**：`src/pages/toolbox/Index.vue`

- 响应式状态：
  - `keyword = ref('')`
  - `selectedCategoryId = ref('debug')` — 默认选中第一个分类
  - `sortKey = ref('latest')`
  - `currentPage = ref(1)`
  - `PAGE_SIZE = paginationConfig.pageSize`（8）
- 计算属性：
  - `filteredArticles`：按 categoryId + keyword（搜索 title/summary/author）+ sortKey 处理
  - `totalPages`：`Math.ceil(filteredArticles.length / PAGE_SIZE)`
  - `pagedArticles`：按 currentPage 切片 filteredArticles
- 函数：
  - `onCategoryChange(id)`：更新 selectedCategoryId，重置 currentPage 为 1
  - `onSearch()`：重置 currentPage 为 1（按搜索按钮触发）
  - `onSortChange(key)`：更新 sortKey，重置 currentPage 为 1
  - `onPageChange(page)`：更新 currentPage
  - 监听 keyword 变化：重置 currentPage 为 1（watch debounce 可选，先直接 watch）
- 布局：
  - 页面头部：标题 + 描述 + "提交手册"按钮（`file-plus-2` 图标）
  - `lg:grid-cols-12`：左侧 ToolCategorySidebar (3) + 主内容 (9)
  - 主内容：ToolboxSearchBar + ToolArticleList + ToolboxPagination
- 移动端：分类侧栏 `hidden lg:block`，暂无移动端筛选胶囊（HTML 中没有移动端分类切换）

### 步骤 6：注册路由

**文件**：`src/router/index.ts`

在路由数组末尾追加：

```typescript
{
  path: '/toolbox',
  name: 'toolbox',
  component: () => import('@/pages/toolbox/Index.vue'),
}
```

### 步骤 7：样式处理

- 统一 Tailwind + scoped CSS（不使用 SCSS）
- `line-clamp-2` 使用 scoped CSS
- 卡片 hover 效果使用 Tailwind 状态变体
- 分类选中态使用 `bg-primary text-white`（与原 HTML 一致，无分类颜色映射）

## 涉及文件清单

| 文件 | 操作 |
|------|------|
| `src/types/home.ts` | 修改：追加 3 个 IconName |
| `src/components/ui/IconRenderer.vue` | 修改：追加 3 个图标导入和映射 |
| `src/types/pageDesign/toolbox.ts` | 新建：类型定义 |
| `src/data/pageDesign/toolbox.ts` | 新建：结构化数据 |
| `src/pages/toolbox/Index.vue` | 新建：页面入口 |
| `src/pages/toolbox/ToolCategorySidebar.vue` | 新建：左侧工具分类栏 |
| `src/pages/toolbox/ToolboxSearchBar.vue` | 新建：搜索栏+排序 |
| `src/pages/toolbox/ToolArticleItem.vue` | 新建：文章卡片 |
| `src/pages/toolbox/ToolArticleList.vue` | 新建：文章列表容器 |
| `src/pages/toolbox/ToolboxPagination.vue` | 新建：分页组件 |
| `src/router/index.ts` | 修改：添加 /toolbox 路由 |

## 验证方式

1. `npx vue-tsc --noEmit` 类型检查通过
2. `npm run dev` 访问 `http://localhost:5173/toolbox`
3. 对比 `page-design/toolbox/toolbox.html`：
   - 左栏3/12 + 主内容9/12 布局一致
   - 6个分类卡片样式和选中态正确（调试助手默认选中 bg-primary 白字）
   - 搜索框、搜索按钮、排序按钮布局一致
   - 5篇文章卡片：标题、摘要、作者头像+姓名+日期 完整显示
   - 分页组件页码显示和选中态正确
   - "提交手册"按钮带 file-plus-2 图标
4. 分类切换：点击不同分类，文章列表变化，分页重置为第1页
5. 搜索过滤：输入作者名或关键词，文章过滤正确
6. 分页导航：上一页/下一页/页码点击，当前页高亮正确，边界禁用
7. 响应式：sm 断点下搜索栏垂直排列，lg 断点下侧栏显示/隐藏
