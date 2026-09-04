# SSR 化可行性评估与待办

日期：`2026-09-03`

状态：评估完成，方案未定 —— 待用户确认动机与托管形态后立项（见文末「待定项」）。

## 结论摘要

理论完全可行（Nuxt 3/4 与当前 Vue 3 + Vite + vue-router + Pinia 同构）；但仓库现状是
**纯静态 SPA、mock 数据、无部署层**，全量迁 Nuxt 的成本集中在数据层（取数源与取数时机），
而非组件层（组件可平移率 >90%）。若动机仅为 SEO / 分享卡片，Vite 侧构建期预渲染是更轻的替代路径；
若动机是真实用户首屏加速，才值得考虑 Nuxt（成本接近，一步到位）。

## 现状事实（仓库核查证据）

| 事实 | 证据 |
| --- | --- |
| Vue 3.5 `<script setup>` 全站，路由为 13 条静态表 | `src/router/index.ts` |
| 20+ 页面/组件直接 `import '@/data/...'` 静态数据，不经网络 | 论坛详情等页面：`src/pages/forum-post-detail/Index.vue` 头部 import |
| 仅 challenges 三页真正消费 `src/api` + MSW | `src/pages/challenges/`、`challenge-detail/`、`challenge-new/` |
| MSW 仅 dev 生效（`DEV && VITE_ENABLE_MSW=true` 门控），生产构建无 mock | `src/main.ts`；`src/api/http.ts` 用 `window.location.origin` |
| 浏览器 API 使用收敛：全库 15 处，均在 `onMounted`/事件回调内（Navbar 滚动、BeamsBackground canvas、scrollTo、clipboard），无模块求值期 DOM 访问 | `rg "window\\.|document\\.|localStorage|navigator\\." src` |
| mermaid / 代码高亮等客户端渲染集中在 `PostContent` 挂载后二次解析 | `src/components/PostContent.vue`（onMounted + watch） |
| Pinia + persistedstate（localStorage，SSR 需处理） | `src/store/index.ts` |
| 富文本编辑器 wangeditor/vditor 为 DOM/CDN 重型库；vditor 构建期 `viteStaticCopy` 到 `/vditor/dist` | `vite.config.ts` |
| Element Plus 经 unplugin 按需自动导入，样式随 JS 注入 → SSR 直出 HTML 无样式 | `vite.config.ts` |
| 无 `.github/workflows`、无 server 目录 → 当前形态为纯静态托管 | 仓库根目录 |

## 迁移路线（按动机三选一）

### 做法 A：静态卡片页 —— 动机：微信/分享链接要标题与摘要

分享爬虫不执行 JS，只能拿到空壳 `index.html`。为每条内容路由生成带 `og:` meta 的薄 HTML：

- 路由清单从数据源推导（`ch-1..ch-12`、论坛帖子 id、课程 id 等）
- `scripts/generate-content-pages.mjs`：读 `src/data/pageDesign/*`，输出每内容 id 的静态卡片页
  （`<title>` + `og:*` + 摘要 + 原文链接）
- 零 Vue 改动、无 hydration 问题、纯静态托管可用

代价：分享链接指向卡片页而非终极 URL；搜索引擎只收录摘要，不收录全文。

### 做法 B：构建期整页快照 + 爬虫分流 —— 动机：全文收录

- `scripts/prerender-snapshots.mjs`：以 `VITE_ENABLE_MSW=true` 起临时 `vite dev`，
  用无头浏览器（可复用 Playwright MCP 通道）访问内容路由至 `networkidle`
- 抓 `#app` 渲染后 HTML + 标题，替换资源 URL，输出独立快照（爬虫 HTML 无需 CSS/JS，保留正文结构）
- 部署需一层按 UA 分流的服务器（nginx / CDN edge function）：爬虫 UA → 快照；真实用户 → SPA

可行性依据：快照在真实浏览器内执行，MSW 正常拦截，challenges 详情正文可抓；
`PostContent` 的 mermaid/高亮在挂载后完成，等 `networkidle` 即可拿到已渲染正文。代码零侵入。

### 做法 C：真实用户 SSR 直出（或直接迁 Nuxt）—— 动机：首屏性能

前置改造（无论自建 SSR 还是迁 Nuxt 都绕不开）：

1. 应用工厂化：`src/main.ts` 模块顶层 `createApp` + `router.isReady()` → 拆出每次渲染独立的工厂
2. 取数：内容页静态 data 服务端同源读取（无水合漂移，架构红利）；challenges 页跑在可变 mock 态上，
   应移出预渲染白名单或接受「快照 = 构建时种子」；服务端真取数需真实后端或 `msw/node setupServer`
3. Element Plus SSR 样式收集（unplugin 按需样式不随直出 HTML 输出）—— 主要隐藏成本
4. `pinia-plugin-persistedstate` 服务端禁用；浏览器 API 已盘点安全

若动机是首屏性能，Nuxt 与自建 SSR 的工作量相差不大，倾向直接评估 Nuxt 全量迁移（混合渲染：
内容页 SSR、交互页免 SSR）。

## 决策建议

| 动机 | 选做法 | 成本 |
| --- | --- | --- |
| 分享卡片要标题/摘要 | A | 半天，零风险 |
| 搜索引擎收录正文 | B | 1–2 天 + 需要一台服务器分流 |
| 真实用户首屏加速 | C / 迁 Nuxt | 接近迁 Nuxt 六成工作量，纯静态托管下无意义 |

A 与 B 是同一脚本家族（生成器 vs 快照器），可先做 A 验证链路再补 B。

## 待定项（阻塞立项）

- [ ] 迁移动机：分享卡片 / 全文收录 / 真实用户首屏？
- [ ] 目标托管形态：纯静态，还是有 nginx / CDN edge function？
- [ ] 是否接受引入无头浏览器依赖用于构建期快照（或复用既有 Playwright 通道）？

## 行动项（待立项后拆解）

- [ ] 若走 A/B：最小 spike —— 仅对 `/forum/post/:id` 跑一遍快照/生成脚本，验证可行性与产出质量
- [ ] 若走 C/Nuxt：以 challenges 详情页为试点迁移，验证数据层（MSW → SSR 取数）假设
- [ ] 立项后补 `docs/plans/` 计划（含里程碑与验收条件）与 `records/` 交付记录
