# 课程中心页面（CoursesPage）Vue 工程化转换

**日期**: 2026-06-05  
**转换来源**: `page-design/courses/courses.html`  
**转换方案**: `page-design/courses/courses.md`

## 功能概述

将 courses.html（251行，左侧分类栏 + 课程卡片网格布局）转为 Vue 3 + TypeScript + Tailwind 工程化页面，包含：
- 左侧分类侧边栏（3 个分组，9 个子分类，手风琴展开/收起 + chevron 旋转动画）
- 6 张课程卡片（渐变 Banner、首字母水印、分类标签、标题/摘要、作者信息）
- 传统分页组件（页码 + 省略号 + 前后翻页）
- 点击子分类筛选课程列表

## 修改文件清单

### 修改已有文件
| 文件 | 变更说明 | 是否影响其他模块 |
|------|---------|----------------|
| `src/router/index.ts` | 新增 `/courses` 懒加载路由 | 否，仅追加 |

### 新建文件
| 文件 | 说明 |
|------|------|
| `src/types/pageDesign/courses.ts` | 类型定义：CourseItem, CourseCategoryGroup, CourseSubCategory, CourseAuthor, CoursesPageMeta, PaginationConfig |
| `src/data/pageDesign/courses.ts` | 结构化数据：3 个分类组、9 个子分类、6 门课程、分页配置 |
| `src/pages/courses/Index.vue` | 页面入口，含分类筛选（空串=显示全部）+ 分页逻辑 |
| `src/pages/courses/CourseCard.vue` | 课程卡片：渐变 Banner + 首字母水印 + 分类标签 + 作者信息 |
| `src/pages/courses/CourseGrid.vue` | 响应式卡片网格容器（sm:2列 lg:3列） |
| `src/pages/courses/CourseCategorySidebar.vue` | 左侧手风琴分类栏，默认展开所有分组 |
| `src/pages/courses/CoursePagination.vue` | 传统分页（复用 toolbox 的分页模式） |

## 对其他模块的影响

- **无破坏性影响**。所有变更均为追加式。
- 复用现有组件：`IconRenderer`、`TagBadge`，无需修改。
- 新路由与其他页面独立，无 Pinia store 依赖。
- 首屏默认展示全部 6 门课程（不筛选），与 courses.html 行为一致。

## 验证修复记录

验证 agent 发现并修复 3 个问题：
1. `PaginationConfig` 接口未从 types 文件导出（补全类型导出）
2. 5 个函数缺少返回值类型标注（添加 `: void` / `: string`）
3. 首屏默认筛选"无线接入网"仅显示 1 张卡片，与 HTML 展示全部 6 张不符（改为空串默认值，显示全部课程）
