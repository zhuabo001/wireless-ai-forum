# MSW 模拟接口接入进度

计划文档：`docs/msw-mock-api-plan.md`

| 里程碑 | 状态 | 证据 |
| --- | --- | --- |
| 1. 依赖与 worker 初始化 | 完成 | `msw@^2.15.0` 入 devDependencies；`public/mockServiceWorker.js` 由 `npx msw init` 生成 |
| 2. mocks 目录与 handlers | 完成 | `src/mocks/handlers/` 7 个域模块（forum/courses/intelligence/practices/market/toolbox/home），统一 `/api` 前缀，支持分页与过滤 |
| 3. API client | 完成 | `src/api/` http 封装 + 7 个域 endpoint 模块，复用 `src/types/` 领域类型 |
| 4. 启动接入 | 完成 | `src/main.ts` 挂载前按 `DEV && VITE_ENABLE_MSW` 启动 worker；`.env.development` 默认开启 |
| 5. 验证 | 完成 | 见下 |

## 验证记录

- `npm run check`：lint + type-check + build 全部通过（2026-08-12）。
- 浏览器实测（dev `:5199`，MSW worker 拦截）：
  - `GET /api/forum/topics?page=1&pageSize=3` → total 6、返回 3 条，分页正确。
  - `GET /api/courses?keyword=AI` → 过滤后 total 4。
  - `GET /api/forum/posts/1` → 返回帖子标题与 contentHtml（4618 字符）。
  - `GET /api/forum/posts/1/comments?sort=likes&pageSize=2` → total 4，按点赞排序（首条 31 赞）。
  - `GET /api/home` → 10 个 sections。
  - `GET /api/forum/posts/not-exist` → 404，错误路径符合预期。
- 未验证项：页面组件未接入远程取数（计划内范围外）；写接口未提供（计划明确不做）。

## 交付说明

- 假设披露：帖子 mock 数据仅一条（`postDetail.id === '1'`），详情/评论接口对其他 id 返回 404。
- 页面仍直接 import `src/data/`，接口层作为独立基础设施交付，后续页面改造可渐进接入。

## 独立审查与修复（2026-08-12）

按治理契约以双独立代理完成 Standards + Spec 两轴审查，结论与处理：

**Spec 轴**
- 论坛列表过滤值与 meta 广告互不兼容（实质缺陷）→ 已修复：`tab` 对应 `forumTabs`
  （hot 按热度、其余按 tab 名匹配 categoryBadge），`category` 对应 `categoryFilterOptions`
  （my-posts 按 currentUser 过滤、my-replies 无 mock 数据返回空），`sort` 支持
  `latest`/`hottest`/`newest-reply`。
- `/api/forum/stats` 缺失 → 已补齐。
- `/api/market/items` → 实现为 `/api/market/agents`（更贴合数据语义），计划文档接口表已对齐。
- meta/navigation 端点属计划外补充 → 计划文档接口表与约定已补充说明。
- `VITE_ENABLE_MSW` 原为 opt-out → 改为 opt-in（`=== 'true'` 才启用）。
- main.ts pinia 顺序变化 → 审查误报：原代码本就在 `router.isReady()` 后安装 pinia，语义未变。

**Standards 轴**
- `PagedResult` 双处定义 → 提取至 `src/types/api.ts`（含 `PageQuery`），两侧复用。
- market 内联类型 → `MarketSortOption`/`UsageGuide` 入 `src/types/pageDesign/market.ts` 并复用。
- 6 个列表 handler 重复形状 → `createListHandler` 工厂（`src/mocks/handlers/utils.ts`）收敛。
- `page/pageSize` 数据团 → 各域 query 接口统一 `extends PageQuery`。
- package.json 末尾换行 → 已补。
- 哨兵值 `'all'`/`'全部'` 差异 → 保留，与各域页面现有筛选项取值一致（记录为已知判断）。

**修复后验证**：`npm run check` 通过（exit 0）；浏览器实测 `tab=tech-discussion`
仅返回「技术探讨」、`sort=hottest` 按点赞降序、`category=my-posts` 返回空、
`/api/forum/stats` 返回 3 统计 + 6 热榜、评论分页排序正常。
