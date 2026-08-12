# Plan: Courses Page Vue Conversion

## Context

Convert `page-design/courses/courses.html` into a Vue page following the project's established patterns from other converted pages (toolbox, practices, market, intelligence). The courses page features a left category sidebar with 3 accordion-style groups (9 sub-categories), a grid of 6 course cards with gradient banners, and pagination.

## Files to Create

### 1. `src/types/pageDesign/courses.ts` — Type Definitions

```ts
export interface CourseAuthor {
  name: string
  employeeId: string
  department: string
}

export interface CourseItem {
  id: string
  title: string
  summary: string
  categoryId: string        // references sub-category id
  initials: string           // 2-char overlay on gradient banner
  gradientFrom: string       // Tailwind gradient start, e.g. "from-blue-500"
  gradientTo: string         // Tailwind gradient end, e.g. "to-indigo-600"
  author: CourseAuthor
}

export interface CourseSubCategory {
  id: string
  name: string
}

export interface CourseCategoryGroup {
  id: string
  name: string
  children: CourseSubCategory[]
}

export interface CoursesPageMeta {
  title: string
  description: string
}

export interface PaginationConfig {
  pageSize: number
}
```

### 2. `src/data/pageDesign/courses.ts` — Static Data

Extract all hardcoded data from the HTML:
- `coursesMeta`: title "课程中心", description "把公司内外的优秀课程在社区分享"
- `courseCategoryGroups`: 3 groups (无线技术, AI基础, Agent开发) with 9 sub-categories total
- `courseItems`: 6 courses (LLM, LC, CR, 5G, AG, MM) with full author info, gradient colors, category references
- `paginationConfig`: `{ pageSize: 6 }` (all 6 cards on one page by default)
- Default active sub-category: "无线接入网"

### 3. `src/pages/courses/Index.vue` — Page Orchestrator

- Uses `<script setup lang="ts">`
- Reactive state: `selectedCategoryId` (ref), `currentPage` (ref)
- Computed: `filteredCourses` (filter by category), `pagedCourses` (slice by page)
- Layout: `pt-16` offset → page header → `grid lg:grid-cols-12` with sidebar (col-span-3) + main (col-span-9)
- Imports and wires all child components

### 4. `src/pages/courses/CourseCategorySidebar.vue` — Left Sidebar

- Accordion-style category groups matching the HTML exactly
- Each group has a toggle button (group name + chevron-down icon)
- Active group expands to show sub-category links
- Active sub-category highlighted with `text-primary bg-primary/10 rounded-md font-medium`
- Groups can use Element Plus `ElCollapse` for accordion behavior, styled to match the original design
- Emits: `update:selectedCategoryId`

### 5. `src/pages/courses/CourseGrid.vue` — Card Grid Container

- Responsive grid: `grid sm:grid-cols-2 lg:grid-cols-3 gap-5`
- Renders `CourseCard` for each item
- Props: `courses: CourseItem[]`

### 6. `src/pages/courses/CourseCard.vue` — Individual Course Card

- Gradient banner (`h-36`) with initials overlay and category badge
- Body: title (line-clamp-2), summary (line-clamp-2), author block with avatar dot
- Hover effects: `hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group`
- Title color transition: `group-hover:text-primary`
- Props: `course: CourseItem`

### 7. `src/pages/courses/CoursePagination.vue` — Pagination

- Uses Element Plus `ElPagination` with small layout, background style
- Shows prev/next buttons, page numbers, optional ellipsis
- Props: `currentPage: number`, `totalPages: number`
- Emits: `update:currentPage`

Or alternatively, use a custom pagination component matching the HTML's exact button style (numbered buttons + ellipsis + prev/next chevrons) if Element Plus styling is too divergent.

## Files to Modify

| File | Action |
|------|--------|
| `src/router/index.ts` | Add lazy-loaded `/courses` route pointing to `@/pages/courses/Index.vue` |

## Reusable Components to Leverage

From `src/components/ui/`:
- `IconRenderer` — for all Lucide icons (chevron-down, chevron-left, chevron-right, etc.)
- `TagBadge` — for category badges on course cards
- `BaseCard` — may wrap course cards, but the gradient banner layout may require a custom card

## Element Plus Usage (per courses.md guidance)

| Component | Where |
|-----------|-------|
| `ElPagination` | CoursePagination — page buttons with prev/next |
| `ElCollapse` / `ElCollapseItem` | CourseCategorySidebar — accordion filter groups |
| `ElTag` | Optional — category labels if needed |

## What NOT to Do

- Do NOT use `ElCard` for course cards — the custom gradient banner + author block layout requires a bespoke component
- Do NOT use Element Plus layout components — keep CSS grid
- Do NOT add new UI features (search bar, source/difficulty filters) not present in the original HTML
- Do NOT use CDN dependencies — all icons go through IconRenderer

## Verification

1. `npm run dev` — start dev server
2. Navigate to `/courses` — page loads with header "课程中心"
3. Left sidebar: 3 accordion groups, clicking toggles sub-categories; "无线接入网" active by default
4. Course grid: 6 cards in responsive grid, each with gradient banner, title, summary, author
5. Click a sub-category filter — card list filters correctly
6. Pagination: prev/next and page buttons work; page 1 active by default
7. Compare against `page-design/courses/courses.html` for visual consistency (spacing, colors, typography)
8. No CDN dependencies in page source
