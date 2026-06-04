# 优秀实践页面（PracticesPage）Vue 工程化转换

**日期**: 2026-06-05  
**转换来源**: `page-design/practices/practices.html`  
**参考实现**: `src/pages/market/`  

## 功能概述

将 practices.html（333行，三栏布局）转为 Vue 3 + TypeScript + Tailwind 工程化页面，包含：
- 左侧实践分类树（展开/收起、选中高亮）
- 中间实践文章列表（筛选、分页）
- 右侧信息栏（今日热帖、热门贡献者、热门团队）

## 修改文件清单

### 修改已有文件
| 文件 | 变更说明 | 是否影响其他模块 |
|------|---------|----------------|
| `src/types/home.ts` | 新增 9 个 IconName 值：`plus`, `radio-tower`, `chevron-down`, `flask-conical`, `code-2`, `sliders-horizontal`, `flame`, `medal`, `building-2` | 否，仅追加，无破坏性变更 |
| `src/components/ui/IconRenderer.vue` | 新增 9 个 lucide 图标导入和 iconMap 映射 | 否，仅追加，回退图标 `Zap` 不变 |
| `src/router/index.ts` | 新增 `/practices` 懒加载路由 | 否，Navbar 已存在该导航项 |

### 新建文件
| 文件 | 说明 |
|------|------|
| `src/types/pageDesign/practices.ts` | 类型定义：PracticeCategory, PracticeItem, HotPost, Contributor, Team 等 9 个接口/类型 |
| `src/data/pageDesign/practices.ts` | Mock 数据：3 个分类（9 个子分类）、4 篇文章、3 条热帖、3 位贡献者、3 个团队 |
| `src/pages/practices/Index.vue` | 页面入口，含筛选/分页逻辑 |
| `src/pages/practices/PracticeCategorySidebar.vue` | 左侧分类树组件 |
| `src/pages/practices/PracticeToolbar.vue` | 筛选工具栏组件 |
| `src/pages/practices/PracticeCard.vue` | 文章卡片组件 |
| `src/pages/practices/PracticeList.vue` | 文章列表容器组件 |
| `src/pages/practices/PracticeSidebar.vue` | 右侧栏容器组件 |
| `src/pages/practices/HotPostList.vue` | 今日热帖面板组件 |
| `src/pages/practices/ContributorList.vue` | 热门贡献者面板组件 |
| `src/pages/practices/TeamList.vue` | 热门团队面板组件 |

## 对其他模块的影响

- **无破坏性影响**。所有修改均为追加式。
- IconRenderer 新增的图标可被任何其他组件使用。
- 新路由与其他页面独立，不影响 HomePage 和 MarketPage。
- 未修改任何已有 section 组件、pinia store 或数据文件。
