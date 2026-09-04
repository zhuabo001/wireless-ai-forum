# 挑战英雄榜试点接入 vue-query（TDD 钉死接口行为）

日期：`2026-09-04`

来源：`docs/todo/tanstack-vue-usage.md` 评估结论落地试点；用户确认「引入 vitest 以 TDD 钉死接口行为」。

任务等级：L2（多文件功能 + 多个验收条件），走正式闭环。

## 背景与痛点

挑战英雄榜三个页面当前是裸 fetch + `onMounted` 手动加载，存在三类已核实的痛点：

1. **状态机转移在前端硬编码、与 mock 服务端重复**：`challenge-detail/Index.vue` 的 `handleClaim` 手动 `status='solving'`（108-113 行）、`handleScoreConfirm` 手动 `scoring→open`（150-152 行），同一规则 mock 服务端也有一份。
2. **mutation 后逐字段手抄响应到本地 ref**（105-178 行），不重新 fetch，易漂移。
3. **列表页仅 onMounted 加载一次**，详情页揭榜/评分后返回列表展示旧值。

方案：引入 `@tanstack/vue-query` 做接口级缓存，mutation 后用 `invalidateQueries` 替代手动抄字段，删除前端硬编码状态机。

**关于 TDD**：仓库目前零测试基建（无 vitest、无 test 脚本、无 spec 文件）。本次引入 vitest，先用契约测试钉死 API 层与 MSW handlers 的现有行为（状态机转移、字段联动、错误码），再动页面——即「测试先行钉死现有行为 → 改造 → 测试保持绿」的节奏。

**已确认的两项决策**：

- vitest 测试**并入 `npm run check` 门禁**（置于 build 之前 fail fast）。
- 缓存效果用「测试断言请求次数 + dev 下 MSW 日志」验证，**不引入 vue-query-devtools**。

## 验收条件

1. 契约测试（查询约 14 例 + 状态机约 18 例）针对**未改动的现状**全绿，作为改造前的行为基线。
2. 挑战英雄榜三页（列表/详情/发布）完成 vue-query 改造，删除前端硬编码状态机与手动抄字段逻辑。
3. 集成测试（约 8 例）钉死缓存行为：同 key 去重、staleTime 内零请求、role 入 key、mutation 后 invalidate 重取、响应式 queryKey。
4. dev 下 MSW 日志可观测缓存效果：二次进入同一详情、返回列表无对应请求；mutation 后可见重取。
5. `npm run check`（lint + type-check + test + build + verify-build）通过，test 已并入 check。

## 技术关键事实（已核实）

- Vite 8 为 rolldown 内核（`vite.config.ts` 用 `rolldownOptions`）→ **测试用独立 `vitest.config.ts`**，不 import vite.config.ts，测试管线零插件，规避兼容风险。
- `tsconfig.json` include 仅 `src/**` + 两个 d.ts；lint 脚本为 `eslint src` → **测试文件放 `src/api/__tests__/`**，门禁零改动且测试代码同受 lint/type-check 约束。
- `src/api/http.ts` 依赖 `window.location.origin` → node 测试环境 setup 中 3 行 stub。
- MSW handlers 的 `items`/`detailStore` 是模块级可变状态，vitest 文件间隔离、文件内共享 → mutation 用例必须先 `createChallenge` 造专属 id；固定种子 id 一个用例专属（ch-1/2 scoring、ch-3 solving、ch-4 open、ch-5 closed）。
- 测试侧用 `msw/node` 的 `setupServer` **复用 `src/mocks/handlers/index.ts` 全量 handlers**，零新增 mock；`onUnhandledRequest: 'error'` 比 browser 的 bypass 更严。
- `src/api/challenges.ts` 共 9 个函数（4 查询 + 5 变更），与 handlers 9 端点一一对应。

## 里程碑

| 里程碑 | 预期输出 | 验证 |
| --- | --- | --- |
| M1 测试基建 + 契约测试钉死现状 | vitest.config.ts、src/test/*、查询+状态机两组约 32 例针对未改动的现状全绿；scripts 加 test 并入 check | `npx vitest run` 全绿；lint + type-check 通过；零业务代码改动。若暴露 handler 与预期不符，记入 progress 备注，**不改 handlers** |
| M2 接入插件 | queryClient/challengeKeys/main.ts 接线，页面未改、行为不变 | `npm run dev`（VITE_ENABLE_MSW=true）功能回归正常；`npm run check` 通过 |
| M3 列表页 + 发布页改造 | 双页 useQuery/useMutation 改造完成 | dev 手测筛选/翻页/防抖参数正确；列表→发布页 meta 零请求（MSW 日志无 `/api/challenges/meta`）；发布后回列表自动重取含新题；vitest 全绿 |
| M4 详情页改造 | 详情/评论 useQuery + 4 个 useMutation + 删除硬编码状态机 | dev 手测：揭榜→详情自动刷新 solving；取消→状态/进度以服务端响应为准；角色切换重取；详情操作后回列表自动重取；vitest 全绿 |
| M5 集成测试补齐 + 收尾 | challengesVueQuery.spec.ts 约 8 例全绿；最终 record | 全部约 40 例 `npx vitest run` 绿；`npm run check`（含 test）通过；缓存命中证据：二次进入详情 MSW 日志无 `/api/challenges/:id` 请求 |

TDD 节奏：M1 先把契约测试写在现状上（应全绿，作为改造前的行为基线）；M3/M4 页面改造期间契约测试必须保持绿（它们测的是 API+handlers 层，页面重构不影响）；M5 补集成测试钉死缓存行为。

## 关键设计决策

### 新增文件

| 文件 | 说明 |
| --- | --- |
| `vitest.config.ts` | 独立配置：`environment: 'node'`、`globals: false`、`setupFiles: ['src/test/setup.ts']`、`include: ['src/**/*.spec.ts']`、`@` alias |
| `src/test/setup.ts` | window stub + MSW server 生命周期（beforeAll listen / afterEach resetHandlers+removeAllListeners / afterAll close） |
| `src/test/server.ts` | `setupServer(...handlers)` 实例 + 助手：`createTestChallenge()`（造专属 id）、`countRequests(predicate)`（基于 `server.events.on('request:start')`，断言「缓存命中 = 零请求」的手段） |
| `src/api/__tests__/challengesQueries.spec.ts` | 查询契约约 14 例：meta 七字段、分页形状、tab/department/date/keyword/sort 过滤排序（score=null 沉底）、detail 的 role 差异与 404、评论排序 |
| `src/api/__tests__/challengesStateMachine.spec.ts` | 状态机契约约 18 例：create 校验 400 与 unshift 联动；score 的 scoring→open、调分 timeline、结题 409；claim 成功/重复 409/404；cancel 的 claimant=null、progressPercent=0、status 分支（已评分回 open、未评分回 scoring）、结题 409；progress 校验与 timeline 转换 |
| `src/api/__tests__/challengesVueQuery.spec.ts` | 集成行为约 8 例：同 key 去重（计数=1）、staleTime 内零请求、staleTime=0 重取、**role 入 key 各自独立缓存**、mutation→invalidate→重取、list 前缀失效不影响 detail、detailPrefix 失效全部 role 变体、响应式 queryKey（computed filters）自动重取 |
| `src/api/challengeKeys.ts` | queryKey 工厂：`all/meta/lists/list(filters)/details/detail(id, role)/detailPrefix(id)/comments(id, sort)`；**role 必须进 key**（mock 详情按 role 返回不同 viewerRole） |
| `src/api/queryClient.ts` | QueryClient 单例：`staleTime: 30s`、`gcTime: 5min`、`refetchOnWindowFocus: false`、retry 对 4xx ApiError 短路 |
| `src/composables/useChallenges.ts` | 查询 hooks（`useChallengeMeta` staleTime=Infinity、`useChallengeList(filters)`、`useChallengeDetail(id, role)`、`useChallengeComments(id, sort)`，queryKey 用 computed 包 MaybeRefOrGetter）+ 变更 hooks（claim/cancel/score/progress → onSuccess 只 invalidate `detailPrefix(id)` + `lists()`；create → invalidate `lists()`） |

### 修改文件

| 文件 | 改动 |
| --- | --- |
| `package.json` | 加 `@tanstack/vue-query`（dep）与 `vitest`（devDep）；scripts 加 `test: "vitest run"` / `test:watch`；`check` 在 build 前插入 `npm run test` |
| `src/main.ts` | `await enableMocking()` 之后挂 `app.use(VueQueryPlugin, { queryClient })` |
| `src/pages/challenges/Index.vue` | meta/列表换 useQuery；filters 聚合成 computed 进响应式 queryKey；keyword 防抖保留在输入侧；删五个 watch + `resetPageAndLoad`（只留「非 page 过滤变化 → 页码归 1」一个 watch）；删手动 `loading` ref，新增 isError + 重试按钮的错误分支 UI |
| `src/pages/challenge-detail/Index.vue` | 详情/评论换 useQuery（role ref 入 key，`onRoleChange` 只改 ref）；4 个 mutation 换 useMutation，onSuccess 只 invalidate + 提示 + 关弹窗；**删除 105-178 行手动抄字段与硬编码状态机**；加载/错误态用 isPending/isError 替代 `challenge===null` 双关；claim 成功后本地 role ref 置 'claimant' 由 key 变化触发重取 |
| `src/pages/challenge-new/Index.vue` | meta 换 useQuery（与列表页同 key 零请求）；submit 换 useCreateChallenge，onSuccess invalidate 后 router.push |

**明确不动**：`src/api/http.ts`、`src/mocks/**` 全部、其他模块页面（forum/courses/practices/intelligence/market/toolbox/home）、router、store、`vite.config.ts`、`eslint.config.js`、`tsconfig.json`、`scripts/verify-build.mjs`。

### 风险与边界

1. **vitest × rolldown-Vite 8 兼容性**是最大不确定性 → M1 最先验证：独立 vitest.config.ts、零插件、node 环境；安装后第一件事 `npx vitest run` 冒烟，peer 冲突则锁兼容版本。
2. 测试文件与新 composable 中的 vue API（ref/computed/toValue）与 vitest API 必须**显式 import**（AutoImport 插件不进测试管线，globals: false）。
3. `server.resetHandlers()` 只重置 handler 覆盖，**不重置模块数据**——状态隔离靠「造专属 id」，不靠 reset。
4. 契约测试**只钉现状不改行为**：如「scoring 状态可揭榜」这类疑点记入 progress 备注交后续任务。
5. 试点范围仅限挑战英雄榜，其余模块验证通过后另行立项推广。
6. 已知代价（评估文档已记录）：`publishTime` 相对时间在缓存期内不刷新，30s staleTime 下可接受。

### 端到端验证

1. `npx vitest run`：约 40 例全绿（契约 + 集成）。
2. `npm run check`：lint + type-check + test + build + verify-build 全过。
3. dev 手测（`VITE_ENABLE_MSW=true npm run dev`）：列表筛选/翻页/防抖正常；详情揭榜/取消/评分/进度后 UI 自动刷新且状态以服务端为准；**二次进入同一详情、返回列表时 MSW 日志无对应请求**（缓存命中）；mutation 后再进相关页面 MSW 日志可见重取（失效生效）。
4. 闭环收尾按 close-development-loop：独立复核 → 人工验收 → `records/` 最终记录。
