# 优秀实践页面（PracticesPage）Vue 工程化转换计划

## 背景

将 `page-design/practices/practices.html`（333行，三栏布局的完整独立页面）转为 Vue 工程化页面。该页面包含左侧分类树、中间实践文章列表（带分页）、右侧信息栏（热帖/贡献者/团队）。Navbar 已存在且已包含 `/practices` 导航项，但路由尚未注册。

**参考实现**：`src/pages/market/Index.vue` 及其子组件（已完成的同类 HTML→Vue 转换）。

## 实施步骤

### 步骤 1：补充 IconRenderer 图标支持

**文件**：`src/components/ui/IconRenderer.vue`、`src/types/home.ts`

practices.html 使用了以下 IconRenderer 中缺失的 lucide 图标：
- `plus` (Plus)
- `radio-tower` (RadioTower)
- `chevron-down` (ChevronDown)
- `flask-conical` (FlaskConical)
- `code-2` (Code2)
- `sliders-horizontal` (SlidersHorizontal)
- `flame` (Flame)
- `medal` (Medal)
- `building-2` (Building2)

**操作**：
1. 在 `src/types/home.ts` 的 `IconName` 联合类型中追加上述 9 个图标名
2. 在 `src/components/ui/IconRenderer.vue` 中导入对应 lucide 组件并加入 `iconMap`

### 步骤 2：创建 TypeScript 类型定义

**文件**：`src/types/pageDesign/practices.ts`

基于 practices.html 中的数据结构，定义以下接口：

```typescript
// 分类项（含子分类）
interface PracticeSubCategory {
  id: string; name: string; count: number;
}
interface PracticeCategory {
  id: string; name: string; icon: IconName; subCategories: PracticeSubCategory[]; expanded: boolean;
}
// 实践文章
interface PracticeItem {
  id: string; title: string; summary: string; author: string; authorAvatar: string; team: string; date: string; views: number; categoryId: string; subCategoryId: string; tags: PracticeTag[];
}
// 标签类型
type PracticeTag = '精华' | '模板' | '案例复盘' | '工具链';
// 热帖
interface HotPost { id: string; title: string; views: string; replies: number; }
// 贡献者
interface Contributor { name: string; avatar: string; practices: number; likes: number; rank: number; }
// 团队
interface Team { name: string; count: number; newThisMonth: number; badge: string; badgeStyle: string; }
// 页面元信息
interface PracticesPageMeta { title: string; description: string; publishButtonText: string; }
// 分类样式映射
type CategoryStyleMap = Record<string, string>;
```

### 步骤 3：创建 Mock 数据文件

**文件**：`src/data/pageDesign/practices.ts`

从 practices.html 提取所有硬编码数据并结构化导出：
- `practicesMeta`：页面标题、描述、发布按钮文案
- `practiceCategories`：3 个主分类（无线研发、测试验证、工程效率），各含 3 个子分类，含图标名和文章计数
- `practiceItems`：4 篇文章（标题、摘要、作者、头像、日期、浏览量、标签、分类归属）
- `hotPosts`：3 条热帖
- `contributors`：3 位贡献者
- `teams`：3 个团队
- `tagStyles`：标签样式映射（精华→emerald、模板→amber、案例复盘→purple、工具链→cyan）
- `categoryStyles`：分类背景色映射

### 步骤 4：创建子组件

所有子组件放在 `src/pages/practices/` 目录下（遵循 `html-convert-to-vue.md` 规则）。

#### 4a. PracticeCategorySidebar.vue
- 左侧粘性侧栏，展示实践分类
- Props: `categories: PracticeCategory[]`, `selectedSubCategoryId: string`
- Emits: `select(categoryId, subCategoryId)`
- 使用 `IconRenderer` 渲染分类图标
- 展开/收起状态用本地 `ref` 管理（默认第一个分类展开）
- 选中态高亮（`bg-primary text-white` / `bg-muted`）

#### 4b. PracticeToolbar.vue
- 当前筛选信息展示（"协议分析" + "当前筛选 18 篇，按最新发布排序"）
- 筛选按钮（使用 lucide `sliders-horizontal` 图标）
- Props: `currentCategoryName: string`, `filteredCount: number`, `sortLabel: string`
- Emits: `filter`（筛选按钮点击，先打桩）

#### 4c. PracticeCard.vue
- 单条实践文章卡片
- Props: `practice: PracticeItem`
- 展示：分类标签 + 特色标签（精华/模板等）、标题、摘要（line-clamp-2）、作者头像+姓名+时间、浏览量
- hover 时阴影增强 + 标题变色
- 标签使用 `ElTag` 或自定义 span（保持原设计样式）

#### 4d. PracticeList.vue
- 文章列表容器
- Props: `items: PracticeItem[]`
- 渲染 `PracticeCard` 列表

#### 4e. HotPostList.vue
- 右侧"今日热帖"面板
- Props: `posts: HotPost[]`
- 火焰图标（flame, text-orange-500）+ 标题
- 每条热帖可点击，hover 标题变色

#### 4f. ContributorList.vue
- 右侧"热门贡献者"面板
- Props: `contributors: Contributor[]`
- 奖牌图标（medal, text-amber-500）+ 标题
- 每位贡献者：头像、姓名、实践数+赞数、排名标签

#### 4g. TeamList.vue
- 右侧"热门团队"面板
- Props: `teams: Team[]`
- 建筑图标（building-2, text-primary）+ 标题
- 每个团队：名称、文章统计、状态标签（活跃/精选/共创）

#### 4h. PracticeSidebar.vue
- 右侧栏容器，组合上述 3 个面板
- Props: `hotPosts`, `contributors`, `teams`

### 步骤 5：创建页面入口 Index.vue

**文件**：`src/pages/practices/Index.vue`

- 使用 `<script setup lang="ts">`
- 导入所有子组件和数据文件
- 响应式状态：
  - `selectedSubCategoryId: ref<string>`（默认 `'protocol-analysis'`）
  - `expandedCategoryId: ref<string>`（默认 `'wireless-rd'`）
  - `currentPage: ref<number>`（默认 1）
  - `pageSize: number`（每页条数，默认 4）
- 计算属性：
  - `currentCategoryName`：根据选中子分类 ID 获取名称
  - `filteredItems`：按选中子分类过滤
  - `pagedItems`：按页码切片
  - `totalPages`：总页数
- 分页器：自定义按钮组（非 ElPagination，保留原设计的简洁按钮组视觉）
- 布局：`max-w-7xl` 容器，`lg:grid-cols-12` 三栏（左侧 3 / 中间 6 / 右侧 3）
- "发布实践"按钮点击先打桩（console.log 或 emit）

### 步骤 6：注册路由

**文件**：`src/router/index.ts`

添加 `/practices` 懒加载路由：
```typescript
{
  path: '/practices',
  name: 'practices',
  component: () => import('@/pages/practices/Index.vue'),
}
```

### 步骤 7：样式处理

- 不使用 SCSS（项目目前无 .scss 文件，统一使用 Tailwind + 原生 CSS）
- 所有样式使用 Tailwind 工具类
- 必要时在 `<style scoped>` 中补充少量自定义 CSS（如 line-clamp-2）
- 粘性定位：左侧和右侧侧栏使用 `sticky top-24`

## 涉及文件清单

| 文件 | 操作 |
|------|------|
| `src/types/home.ts` | 修改：追加 9 个 IconName |
| `src/components/ui/IconRenderer.vue` | 修改：追加 9 个图标 |
| `src/types/pageDesign/practices.ts` | 新建：类型定义 |
| `src/data/pageDesign/practices.ts` | 新建：Mock 数据 |
| `src/pages/practices/Index.vue` | 新建：页面入口 |
| `src/pages/practices/PracticeCategorySidebar.vue` | 新建：左侧分类 |
| `src/pages/practices/PracticeToolbar.vue` | 新建：筛选工具栏 |
| `src/pages/practices/PracticeList.vue` | 新建：文章列表 |
| `src/pages/practices/PracticeCard.vue` | 新建：文章卡片 |
| `src/pages/practices/PracticeSidebar.vue` | 新建：右侧栏容器 |
| `src/pages/practices/HotPostList.vue` | 新建：热帖面板 |
| `src/pages/practices/ContributorList.vue` | 新建：贡献者面板 |
| `src/pages/practices/TeamList.vue` | 新建：团队面板 |
| `src/router/index.ts` | 修改：添加 /practices 路由 |

## 验证方式

1. `npm run dev` 启动开发服务器
2. 访问 `http://localhost:5173/practices`，确认页面渲染无报错
3. 对比 `page-design/practices/practices.html` 在浏览器中的视觉效果：
   - 三栏布局比例一致（3-6-3）
   - 左侧分类展开/收起和选中态正确
   - 文章卡片的标签、标题、作者信息、浏览量展示正确
   - 右侧热帖/贡献者/团队面板数据正确
   - 分页按钮可用且高亮正确
4. 点击"发布实践"按钮确认不会报错（打桩状态）
5. 从首页导航栏点击"优秀实践"可正确跳转
6. TypeScript 类型检查通过：`npx vue-tsc --noEmit`
