# AI情报局页面（IntelligencePage）Vue 工程化转换计划

## 背景

将 `page-design/intelligence/intelligence.html`（306行，两栏布局：左侧筛选 + 右侧卡片列表）转为 Vue 工程化页面。包含左侧分类/时间筛选栏、搜索框、情报卡片列表、"加载更多"按钮。

**前置验证**：所有需要的 lucide 图标（brain, layers, globe, file-code, cpu, shield-check, external-link, search）已存在于 IconRenderer 中，无需新增图标。

**参考实现**：`src/pages/practices/` 和 `src/pages/market/`。

**规则约束**：遵循 `page-design/rules/html-convert-to-vue.md`，子组件放在 `src/pages/intelligence/` 下。

## 实施步骤

### 步骤 1：创建 TypeScript 类型定义

**文件**：`src/types/pageDesign/intelligence.ts`

```typescript
import type { IconName } from '../home'

export interface IntelligenceCategory {
  id: string      // 'all' | 'model' | 'framework' | 'industry' | 'paper' | 'tool' | 'policy'
  name: string    // '全部' | '大模型' 等
  count: number   // 文章计数
}

export interface IntelligenceItem {
  id: string
  title: string
  summary: string          // 摘要（line-clamp-2）
  source: string           // 来源：'AI前线'、'开源中国' 等
  publishedAt: string      // 相对时间：'2小时前'、'昨天'、'2天前'、'3天前'
  categoryId: string       // 关联 IntelligenceCategory.id
  icon: IconName           // 卡片图标块使用的 lucide 图标名
}

export interface IntelligencePageMeta {
  title: string
  description: string
}
```

### 步骤 2：创建结构化数据文件

**文件**：`src/data/pageDesign/intelligence.ts`

从 intelligence.html 提取所有硬编码数据：

- `intelligenceMeta`：`{ title: 'AI情报局', description: '搜罗全球AI热点，聚焦无线研发前沿' }`
- `categoryFilters`：7 个分类，含 id/name/count（全部:65, 大模型:12, 框架:8, 行业:15, 论文:6, 工具:20, 政策:4）
- `timeRangeOptions`：`['今日', '本周', '本月', '全部']`
- `intelligenceItems`：8 条情报卡片（标题、摘要、来源、发布时间、分类ID、图标名）
- `searchConfig`：`{ placeholder: '搜索情报关键词...' }`
- `categoryColorStyles`：categoryId → Tailwind 类名映射：

| 分类 ID | 样式 |
|---------|------|
| `model` | `bg-purple-50 text-purple-600` |
| `framework` | `bg-blue-50 text-blue-600` |
| `industry` | `bg-emerald-50 text-emerald-600` |
| `paper` | `bg-amber-50 text-amber-600` |
| `tool` | `bg-cyan-50 text-cyan-600` |
| `policy` | `bg-rose-50 text-rose-600` |

### 步骤 3：创建子组件

所有组件放在 `src/pages/intelligence/` 下。

#### 3a. IntelligenceCard.vue
- Props: `item: IntelligenceItem`
- 模板：`article`卡片 → `flex items-start gap-4` → 左侧10x10圆角色块（IconRenderer） + 右侧内容（分类标签 + 时间、标题hover变色、摘要line-clamp-2、来源 + external-link图标 + "阅读全文"）
- 通过 `categoryColorStyles` 动态计算标签和图标块颜色

#### 3b. IntelligenceSearch.vue
- Props: `keyword: string`, `placeholder: string`
- Emits: `update:keyword [value: string]`
- 原生 `<input>`（保留原设计圆角和 focus ring），内置 search 图标

#### 3c. IntelligenceSidebar.vue
- Props: `categories: IntelligenceCategory[]`, `timeRanges: string[]`, `selectedCategoryId: string`, `selectedTimeRange: string`
- Emits: `update:selectedCategoryId [value: string]`, `update:selectedTimeRange [value: string]`
- 两部分筛选：内容分类（选中态 `bg-primary text-white`）+ 时间范围（选中态 `text-foreground bg-muted`）
- 粘性定位 `sticky top-24`

#### 3d. IntelligenceList.vue
- Props: `items: IntelligenceItem[]`, `hasMore: boolean`
- Emits: `loadMore []`
- 渲染 `IntelligenceCard` 列表 + "加载更多"按钮 + 空状态提示

### 步骤 4：创建页面入口 Index.vue

**文件**：`src/pages/intelligence/Index.vue`

- 响应式状态：`keyword`（默认''）、`selectedCategoryId`（默认'all'）、`selectedTimeRange`（默认'今日'）、`visibleCount`（默认 6）
- 计算属性：
  - `filteredItems`：按 categoryId + keyword 过滤
  - `displayedItems`：按 visibleCount 切片
  - `hasMore`：visibleCount < filteredItems.length
- `loadMore()`：visibleCount += 4
- 移动端筛选胶囊：inline 在 Index.vue 中（`lg:hidden`），循环 `categoryFilters`
- 布局：`lg:grid-cols-12`，左栏 3，主内容 9
- 时间范围筛选：UI可切换，但 filtering 暂不基于时间（publishedAt为相对字符串），留作扩展点

### 步骤 5：注册路由

**文件**：`src/router/index.ts`

```typescript
{
  path: '/intelligence',
  name: 'intelligence',
  component: () => import('@/pages/intelligence/Index.vue'),
}
```

### 步骤 6：样式处理

- 不使用 SCSS，统一 Tailwind + scoped CSS
- `line-clamp-2` 使用 scoped CSS（与 PracticeCard.vue 一致）
- 卡片 hover 效果使用 Tailwind 状态变体

## 涉及文件清单

| 文件 | 操作 |
|------|------|
| `src/types/pageDesign/intelligence.ts` | 新建：类型定义 |
| `src/data/pageDesign/intelligence.ts` | 新建：结构化数据 |
| `src/pages/intelligence/Index.vue` | 新建：页面入口 |
| `src/pages/intelligence/IntelligenceCard.vue` | 新建：情报卡片 |
| `src/pages/intelligence/IntelligenceSearch.vue` | 新建：搜索框 |
| `src/pages/intelligence/IntelligenceSidebar.vue` | 新建：左侧筛选栏 |
| `src/pages/intelligence/IntelligenceList.vue` | 新建：卡片列表容器 |
| `src/router/index.ts` | 修改：添加 /intelligence 路由 |
| `src/types/home.ts` | **无需修改** |
| `src/components/ui/IconRenderer.vue` | **无需修改** |

## 验证方式

1. `npx vue-tsc --noEmit` 类型检查通过
2. `npm run dev` 访问 `http://localhost:5173/intelligence`
3. 对比 `page-design/intelligence/intelligence.html`：
   - 左栏3/12 + 主内容9/12 布局一致
   - 分类/时间筛选选中态正确
   - 卡片图标块颜色匹配（紫/蓝/绿/琥珀/青/玫红）
   - 搜索框过滤正确
   - "加载更多"首次显示（8条-初始6条=剩余2条），点击后消失
   - 移动端侧栏隐藏、筛选胶囊显示
4. 分类筛选：全部→8条，大模型→2条，框架→1条，工具→2条
5. 搜索过滤：输入"GPT"→1条，"Open"→2条
