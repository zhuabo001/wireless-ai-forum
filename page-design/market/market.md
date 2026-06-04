# market.html Vue 工程化转换方案

## 转换目标

- 将 `market.html` 转换为 Vue 页面组件，保持 Agent 市场当前视觉。
- 当前市场区域未来可能以 iframe 嵌入生产页面；因此 Vue 改造应优先保留页面外壳、筛选栏和卡片视觉，不做交互重设计。
- 保留精选 Agent、搜索与排序、Agent 卡片列表、加载更多、下载排行、新晋开发者、使用指南等结构。
- 静态 Agent 信息和侧栏信息全部迁移为结构化数据。

## 推荐文件结构

- `src/pages/MarketPage.vue`：Agent 市场页面入口。
- `src/data/pageDesign/market.ts`：Agent 列表、筛选项、侧栏榜单、页面文案。
- `src/types/pageDesign/market.ts`：Agent、评分、开发者、排行项类型。
- `src/components/page-design/market/FeaturedAgentGrid.vue`：精选 Agent 区。
- `src/components/page-design/market/MarketToolbar.vue`：搜索、分类、排序。
- `src/components/page-design/market/AgentGrid.vue`：Agent 列表容器。
- `src/components/page-design/market/AgentCard.vue`：Agent 卡片。
- `src/components/page-design/market/MarketSidebar.vue`：侧栏容器。
- `src/components/page-design/market/DownloadRank.vue`：下载排行。
- `src/components/page-design/market/NewDeveloperList.vue`：新晋开发者。
- `src/components/page-design/market/UsageGuide.vue`：使用指南。
- `src/components/page-design/market/MarketIframePanel.vue`：如果生产只嵌 iframe，可作为市场主体的替代实现。

## 结构化数据

建议拆为：

- `pageMeta`：标题、说明、主按钮。
- `featuredAgents`：精选 Agent 的标题、描述、图标、标签、评分、安装量。
- `agentItems`：名称、简介、开发者、分类、标签、评分、下载量、更新时间、状态。
- `categoryOptions`、`sortOptions`：搜索栏下拉选项。
- `sidebar.downloadRank`：排行项。
- `sidebar.newDevelopers`：开发者名称、团队、贡献数。
- `sidebar.guideLinks`：指南标题、说明、链接。

## Element Plus 替换点

- 搜索框使用 `ElInput`。
- 分类和排序使用 `ElSelect`。
- 按钮使用 `ElButton`。
- Agent 标签使用 `ElTag`。
- 评分如果原视觉允许，可使用 `ElRate` 只读模式；否则保留当前星级/数字文本结构。
- 开发者头像可用 `ElAvatar`。

## 不建议替换的区域

- Agent 卡片不建议整体替换为 `ElCard`，原卡片包含自定义图标块、标签、评分、下载量和按钮排布。
- 如果生产主体是 iframe，不应为了 Vue 化重新实现 iframe 内部市场交互；只需要保留外壳和加载/空状态。
- 侧栏排行不建议用表格组件。

## TypeScript 逻辑

- `keyword`、`selectedCategory`、`sortKey`、`visibleCount` 使用 `ref`。
- `filteredAgents` 根据关键字、分类和排序计算。
- “加载更多”只调整 `visibleCount`。
- 如果走 iframe，维护 `iframeLoaded`、`iframeError` 两个状态并提供 skeleton/失败提示。

## 验收标准

- 市场卡片、精选区域和右侧栏视觉与原 HTML 一致。
- Agent、排行、开发者和指南文案不硬编码在 template。
- 搜索、下拉、加载更多由 Vue 状态控制或在 iframe 模式下降级为外壳状态。
- 无 CDN 和内联脚本。

