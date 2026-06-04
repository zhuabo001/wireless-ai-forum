# AI情报局页面（IntelligencePage）Vue 工程化转换

**日期**: 2026-06-05  
**转换来源**: `page-design/intelligence/intelligence.html`  
**参考实现**: `src/pages/practices/`、`src/pages/market/`

## 功能概述

将 intelligence.html（306行，两栏布局）转为 Vue 3 + TypeScript + Tailwind 工程化页面，包含：
- 左侧分类筛选栏（7 个分类 + 4 个时间范围）
- 搜索框（关键词过滤）
- 情报卡片列表（8 条数据，"加载更多"分页模式）
- 移动端筛选胶囊

## 修改文件清单

### 修改已有文件
| 文件 | 变更说明 | 是否影响其他模块 |
|------|---------|----------------|
| `src/router/index.ts` | 新增 `/intelligence` 懒加载路由 | 否，仅追加 |

### 新建文件
| 文件 | 说明 |
|------|------|
| `src/types/pageDesign/intelligence.ts` | 类型定义：IntelligenceCategory, IntelligenceItem, IntelligencePageMeta |
| `src/data/pageDesign/intelligence.ts` | 结构化数据：7 个分类、4 个时间范围、8 条情报卡片、颜色映射 |
| `src/pages/intelligence/Index.vue` | 页面入口，含筛选/加载更多逻辑 |
| `src/pages/intelligence/IntelligenceCard.vue` | 情报卡片组件 |
| `src/pages/intelligence/IntelligenceSearch.vue` | 搜索框组件 |
| `src/pages/intelligence/IntelligenceSidebar.vue` | 左侧筛选栏组件 |
| `src/pages/intelligence/IntelligenceList.vue` | 卡片列表容器组件 |

### 无需修改的文件
| 文件 | 原因 |
|------|------|
| `src/types/home.ts` | brain, layers, globe, file-code, cpu, shield-check 等 8 个图标已存在 |
| `src/components/ui/IconRenderer.vue` | 同上，无需新增导入 |

## 对其他模块的影响

- **无破坏性影响**。所有变更均为追加式。
- 未修改任何已有页面组件、pinia store 或数据文件。
- 新路由与其他页面（首页、Agent市场、优秀实践）独立。
