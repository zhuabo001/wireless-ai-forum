# PracticesPage Vue Conversion Plan

## Context

Convert `page-design/practices/practices.html` into a Vue page component following the patterns established by the existing MarketPage (`src/pages/market/`). The page displays "优秀实践" (Best Practices) — a three-column layout with a category sidebar, article card list with pagination, and a right sidebar showing hot posts, top contributors, and hot teams.

## Requirements

- Follow `html-convert-to-vue.md` rule: place all sub-components in the page directory (`src/pages/practices/`)
- Use `<script setup lang="ts">` throughout
- Use `IconRenderer` for all icons (may need to add missing Lucide icons to `iconMap`)
- Use Element Plus for: `ElButton`, `ElPagination`, `ElTag`, `ElAvatar`
- All data from structured mock data files (no CDN scripts)
- Three-column layout matching the original: `lg:grid-cols-12` with `lg:col-span-3 / 6 / 3`
- Category expand/collapse, article filtering, and pagination controlled by Vue reactive state

## File Structure

```
src/pages/practices/
  Index.vue              # Main page — layout, state, computed logic
  PracticeCategorySidebar.vue  # Left sidebar: category tree with expand/collapse
  PracticeToolbar.vue          # Filter bar above article list (category name + sort/filter)
  PracticeCard.vue             # Single article card
  PracticeSidebar.vue          # Right sidebar container (sticky wrapper)
  HotPostList.vue              # "今日热帖" section
  ContributorList.vue          # "热门贡献者" section
  TeamList.vue                 # "热门团队" section

src/data/pageDesign/practices.ts    # Mock data: categories, articles, sidebar data, page meta
src/types/pageDesign/practices.ts   # TypeScript interfaces

src/router/index.ts                 # Add lazy-loaded route for /practices
```

## Types (`src/types/pageDesign/practices.ts`)

- `PracticeCategory`: `{ id: string, name: string, icon: IconName, count: number, defaultExpanded?: boolean, children: PracticeSubCategory[] }`
- `PracticeSubCategory`: `{ id: string, name: string, count: number }`
- `PracticeItem`: `{ id: string, title: string, summary: string, category: string, tags: string[], author: string, avatar?: string, time: string, views: string, isPinned?: boolean, isFeatured?: boolean }`
- `HotPost`: `{ title: string, views: string, replies: string }`
- `Contributor`: `{ name: string, surname: string, articles: string, likes: string, rank: number }`
- `Team`: `{ name: string, total: string, monthlyNew: string, badge: string, badgeStyle: string }`

## Data (`src/data/pageDesign/practices.ts`)

- `practicesMeta`: title, description, publish button config
- `practiceCategories`: array of 3 root categories, each with 3 subcategories (from HTML)
- `practiceItems`: array of 8+ article items (extend from HTML with realistic mock data)
- `hotPosts`: array of 3 hot post items
- `contributors`: array of 3 contributor items
- `teams`: array of 3 team items

## State & Logic (in `Index.vue`)

| Ref | Purpose |
|---|---|
| `expandedCategoryIds` | `Ref<Set<string>>` — which root categories are expanded |
| `selectedCategoryId` | `Ref<string \| null>` — currently selected subcategory |
| `currentPage` | `Ref<number>` — current page number |
| `pageSize` | `number` — 4 items per page |

| Computed | Purpose |
|---|---|
| `activeCategoryInfo` | Gets the selected subcategory name and count for toolbar display |
| `filteredItems` | Filters `practiceItems` by `selectedCategoryId` |
| `pagedItems` | Slices `filteredItems` for current page |
| `totalPages` | `Math.ceil(filteredItems.length / pageSize)` |

## Component Responsibilities

### `Index.vue`
- Imports all data and child components
- Manages all reactive state (expanded categories, selected category, pagination, keyword)
- Renders three-column grid layout
- Passes props down, handles events (emit-based two-way binding for toolbar/sidebar)

### `PracticeCategorySidebar.vue`
- Props: `categories`, `expandedCategoryIds`, `selectedCategoryId`
- Emits: `update:expandedCategoryIds`, `update:selectedCategoryId`
- Renders the category tree with expandable sections

### `PracticeToolbar.vue`
- Props: `categoryName`, `categoryCount`, `activeCategoryId`
- Shows "当前筛选 X 篇，按最新发布排序" text and a 筛选 button (placeholder action)

### `PracticeCard.vue`
- Props: `item: PracticeItem`
- Renders an article card with tags, title, summary, author avatar+name+time, view count
- Hover effects (shadow, cursor-pointer, group-hover)

### `PracticeSidebar.vue`
- Simple container with `sticky top-24 space-y-6` wrapper
- Renders HotPostList, ContributorList, TeamList inside

### `HotPostList.vue`
- Props: `posts: HotPost[]`
- Renders hot posts section with flame icon

### `ContributorList.vue`
- Props: `contributors: Contributor[]`
- Renders contributor list with ElAvatar (text fallback, no images)

### `TeamList.vue`
- Props: `teams: Team[]`
- Renders team list with badge styling

## Route Registration

Add to `src/router/index.ts`:
```typescript
{
  path: '/practices',
  name: 'practices',
  component: () => import('@/pages/practices/Index.vue'),
}
```

## Icon Updates

Check `src/components/ui/IconRenderer.vue` and add these Lucide icons if missing:
- `radio-tower`, `flask-conical`, `code-2`, `sliders-horizontal`, `flame`, `medal`, `building-2`

## Element Plus Usage

| Component | Location | Purpose |
|---|---|---|
| `ElButton` | Index.vue (header), PracticeCard (publish) | Action buttons |
| `ElPagination` | Index.vue (below list) | Page-based pagination (styled to match original button-group look) |
| `ElTag` | PracticeCard | Article tags (category, essence, template, etc.) |
| `ElAvatar` | ContributorList, PracticeCard | Author/contributor avatars (text fallback) |

## Divergence from practices.md (location only)

The practices.md suggests placing sub-components under `src/components/page-design/practices/`, but `html-convert-to-vue.md` rule #1 requires them under `src/pages/practices/`. Following the rule for consistency with MarketPage.

## Verification

1. `npm run dev` should serve the app without errors
2. Navigate to `/practices` — three-column layout matches the original HTML visually
3. Expand/collapse root categories in left sidebar
4. Click a subcategory — article list filters to that category
5. Pagination works: clicking page buttons shows correct items
6. All data (articles, hot posts, contributors, teams) renders from data file
7. No CDN scripts loaded
8. All icons render correctly
