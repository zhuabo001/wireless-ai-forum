# 百宝箱页面（ToolboxPage）Vue 工程化转换

**日期**: 2026-06-05  
**转换来源**: `page-design/toolbox/toolbox.html`  
**参考实现**: `src/pages/intelligence/`

## 功能概述

将 toolbox.html（220行，两栏布局）转为 Vue 3 + TypeScript + Tailwind 工程化页面，包含：
- 左侧工具分类栏（6 个分类卡片）
- 搜索栏 + 搜索按钮 + 排序按钮（最新/最热/推荐 三态切换）
- 文章列表（标题、摘要、作者头像+姓名+日期）
- 传统分页组件（页码 + 省略号 + 前后翻页）
- "提交手册"按钮

## 修改文件清单

### 修改已有文件
| 文件 | 变更说明 | 是否影响其他模块 |
|------|---------|----------------|
| `src/types/home.ts` | 新增 3 个 IconName：`arrow-down-up`、`bug`、`file-plus-2` | 否，追加式 |
| `src/components/ui/IconRenderer.vue` | 新增 3 个图标导入和 iconMap 映射 | 否，追加式 |
| `src/router/index.ts` | 新增 `/toolbox` 懒加载路由 | 否，仅追加 |

### 新建文件
| 文件 | 说明 |
|------|------|
| `src/types/pageDesign/toolbox.ts` | 类型定义：ToolCategory, ToolArticle, SortOption, ToolboxPageMeta |
| `src/data/pageDesign/toolbox.ts` | 结构化数据：6 个分类、5 篇文章、排序/搜索/分页配置 |
| `src/pages/toolbox/Index.vue` | 页面入口，含筛选/排序/分页逻辑 |
| `src/pages/toolbox/ToolCategorySidebar.vue` | 左侧工具分类栏 |
| `src/pages/toolbox/ToolboxSearchBar.vue` | 搜索栏 + 搜索按钮 + 排序按钮 |
| `src/pages/toolbox/ToolArticleItem.vue` | 文章卡片组件 |
| `src/pages/toolbox/ToolArticleList.vue` | 文章列表容器 |
| `src/pages/toolbox/ToolboxPagination.vue` | 传统分页组件 |

## 对其他模块的影响

- **无破坏性影响**。所有变更均为追加式。
- 已存在图标（file-text, git-merge, terminal, search, shield-check, chevron-left, chevron-right）无需修改。
- 新路由与其他页面独立，无 Pinia store 依赖。

## 验证修复记录

验证 agent 发现并修复 3 个问题：
1. `sortKey` 未应用到文章筛选（major bug）
2. 排序按钮无法切换到第 3 个选项"推荐"（bug）
3. 分页前后翻页按钮缺少 `hover:text-foreground`（minor）
