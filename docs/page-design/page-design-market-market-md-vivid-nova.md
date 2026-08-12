# Market Page Vue 工程化转换 — 开发计划

## Context

将 `page-design/market/market.html`（384行）转换为 Vue 3 独立页面。当前项目仅有首页（`/`），需新增 `/market` 路由。市场页面包含精选 Agent 区、可搜索/筛选/排序的 Agent 卡片网格、加载更多、以及侧栏（下载排行、新晋开发者、使用指南）。

## 参考规则

- `page-design/rules/html-convert-to-vue.md`：子组件放在 `src/pages/market/` 下，页面主体为 `Index.vue`
- `page-design/market/market.md`：Element Plus 替换点、数据/类型文件位置
- 根目录 `CLAUDE.md`：plan → progress → commit 循环

## 文件结构

```
src/
  types/pageDesign/market.ts      -- 新建：Market 页面类型定义
  data/pageDesign/market.ts       -- 新建：Market 页面结构化数据
  pages/market/
    Index.vue                     -- 新建：页面入口，组装所有子组件 + 交互状态
    AgentCard.vue                 -- 新建：Agent 卡片（支持 featured/regular 两种变体）
    FeaturedAgents.vue            -- 新建："本周精选"区域
    MarketToolbar.vue             -- 新建：分类筛选 + 搜索 + 排序
    MarketSidebar.vue             -- 新建：侧栏（下载排行/新晋开发者/使用指南，内联）
  components/Navbar.vue           -- 修改：新增 links 和 activeLabel props
  router/index.ts                 -- 修改：新增 /market 路由
```

## 关键设计决策

1. **AgentCard 合并 featured/regular 变体**：通过 `featured?: boolean` prop 控制尺寸差异（padding、图标大小、字体大小）和底部行（开发者头像 + 安装按钮仅在 regular 模式显示），避免两个几乎相同的组件。（遵循 CLAUDE.md "禁止为了组件化而进行组件抽取"）
2. **侧栏三段内联在 MarketSidebar.vue**：下载排行、新晋开发者、使用指南各仅 5-15 行标记，无交互逻辑，分别抽取会造成过度组件化。
3. **子组件放在 `src/pages/market/`**：遵循 `html-convert-to-vue.md` 规则 1，而非 `market.md` 建议的 `src/components/page-design/market/`。
4. **复用并扩展 Navbar.vue**：新增 `links` 和 `activeLabel` 可选 props（带默认值保持向后兼容），避免内联 50+ 行导航代码。
5. **不使用 ElCard、ElTable、ElRate**：Agent 卡片保留自定义 Tailwind 结构；排行用纯 div；评分保持星标图标 + 文字。
6. **不使用 scoped SCSS**：全量使用 Tailwind 工具类，与项目现有风格一致。卡片渐变色使用 inline style（避免 Tailwind purging 问题）。

## 实施步骤

### Step 1: 创建类型定义 `src/types/pageDesign/market.ts`

定义接口：
- `AgentType`: `'Extension' | 'Skill' | 'MCP' | 'Subagent' | 'Command'`
- `AgentItem`: name, type, desc, downloads, rating, icon, gradientFrom, gradientTo, typeStyle, developer
- `DownloadRankItem`: name, downloads, rank
- `NewDeveloperItem`: surname, fullName, gradientFrom, gradientTo, contribution
- `MarketPageMeta`: title, description

### Step 2: 创建数据文件 `src/data/pageDesign/market.ts`

从 HTML 迁移所有静态数据，导出：
- `marketMeta: MarketPageMeta`
- `featuredAgents: AgentItem[]`（3项）
- `agentItems: AgentItem[]`（至少8项，便于测试加载更多）
- `categoryOptions: string[]`
- `sortOptions: {label: string, value: string}[]`
- `downloadRank: DownloadRankItem[]`（5项）
- `newDevelopers: NewDeveloperItem[]`（3项）
- `usageGuide`: description + link

### Step 3: 修改 Navbar.vue

新增 props：
```ts
links?: NavLink[]
activeLabel?: string
```
默认值使用现有 `navLinks` 和空字符串，保持 HomePage 行为不变。模板中用 `links` 替换硬编码的 `navLinks`，用 `activeLabel` 匹配当前活跃链接的高亮样式。

### Step 4: 创建 AgentCard.vue

Props: `agent: AgentItem`, `featured?: boolean`（默认 false）
- 顶部行：渐变图标块 + 类型标签（TagBadge）
- 名称 + 描述
- 统计行：下载量 + 评分（星标图标）
- 底部行（仅 regular）：开发者渐变头像圆 + 名称 + 安装按钮（ElButton）
- 悬停效果：featured → `hover:shadow-lg hover:-translate-y-1`，regular → `hover:shadow-md hover:-translate-y-0.5`
- 渐变图标块使用 inline style 设置 background

### Step 5: 创建 FeaturedAgents.vue

Props: `agents: AgentItem[]`
- 标题行：sparkles 琥珀色图标 + "本周精选"
- `grid sm:grid-cols-3 gap-4` 渲染 `<AgentCard featured :agent="..." />`

### Step 6: 创建 MarketToolbar.vue

Props: `activeCategory`, `keyword`, `sortKey`, `categories`, `sortOptions`
Emits: `update:activeCategory`, `update:keyword`, `update:sortKey`
- 分类按钮组：普通 `<button>` 元素，选中态 `bg-primary text-white`，非选中态 `bg-white border`
- 搜索框：`ElInput` + prefix 搜索图标
- 排序下拉：`ElSelect`

### Step 7: 创建 MarketSidebar.vue

Props: `downloadRank`, `newDevelopers`, `usageGuide`
- sticky 容器 `top-24`
- 下载排行：编号列表，前3名金银铜色徽章，4-5名灰色
- 新晋开发者：渐变头像圆（显示姓氏首字）+ 姓名 + 贡献描述
- 使用指南：描述文字 + "查看文档"链接

### Step 8: 创建 Index.vue（页面入口）

组合所有子组件：
- 使用 `Navbar`（传入 market 专用 links + `activeLabel="Agent市场"`）
- `FeaturedAgents` 区域
- 12列网格：9列主内容 + 3列侧栏
  - 主内容：`MarketToolbar` + Agent 卡片网格 + "加载更多"按钮
  - 侧栏：`MarketSidebar`
- 交互状态：`keyword`、`selectedCategory`、`sortKey`、`visibleCount`（均为 ref）
- `filteredAgents`（computed）：按分类/关键字过滤 → 排序 → slice(0, visibleCount)
- "加载更多"点击递增 visibleCount

### Step 9: 添加路由 `src/router/index.ts`

```ts
{
  path: '/market',
  name: 'market',
  component: () => import('@/pages/market/Index.vue'),
}
```

## 依赖顺序

| 顺序 | 文件 | 操作 | 依赖 |
|------|------|------|------|
| 1 | `src/types/pageDesign/market.ts` | 新建 | 无 |
| 2 | `src/data/pageDesign/market.ts` | 新建 | Step 1 |
| 3 | `src/components/Navbar.vue` | 修改 | 无 |
| 4 | `src/pages/market/AgentCard.vue` | 新建 | Step 1 |
| 5 | `src/pages/market/FeaturedAgents.vue` | 新建 | Step 4 |
| 6 | `src/pages/market/MarketToolbar.vue` | 新建 | 无 |
| 7 | `src/pages/market/MarketSidebar.vue` | 新建 | Step 1 |
| 8 | `src/pages/market/Index.vue` | 新建 | Steps 3-7 |
| 9 | `src/router/index.ts` | 修改 | Step 8 |

Steps 3 和 6 可并行。Steps 5 和 7 可并行。

## 验证方案

1. **视觉对比**：`npm run dev` → 访问 `/market`，与 `page-design/market/market.html` 逐区对比（精选区、卡片网格、侧栏排行/开发者/指南）
2. **交互验证**：点击分类按钮过滤、输入搜索关键字、切换排序方式、点击"加载更多"
3. **回归检查**：访问 `/`（首页），确认 Navbar 行为和样式不变
4. **DevTools 检查**：无 404、无 Vue 控制台警告、路由 `/market` 正确解析
5. **最终验证**：按 CLAUDE.md 第4步，拉起 verification-agent 比对 plan.md 与所有代码变更
