# 挑战英雄榜试点接入 vue-query（TDD 钉死接口行为）

日期：`2026-09-04`

计划：`docs/plans/refactor/challenges-add-tanstack-cache-plan.md`

进度：`docs/plans/refactor/challenges-add-tanstack-cache-plan-progress.md`

任务等级：`L2`

## 目标

挑战英雄榜三个页面（列表/详情/发布）当前为裸 fetch + `onMounted` 手动加载，存在前端硬编码状态机与 mock 服务端重复、mutation 后手抄响应字段易漂移、返回列表展示旧值三类痛点。本次在挑战英雄榜试点引入 `@tanstack/vue-query` 做接口级缓存与失效联动（评估结论见 `docs/todo/tanstack-vue-usage.md`），并按要求以 TDD 引入 vitest，先用契约测试钉死 API + MSW handlers 现状行为再改造页面。

## 变更文件

| 文件 | 变更 | 影响 |
| --- | --- | --- |
| `vitest.config.ts` | 新增：独立 node 测试配置（零插件、@ alias、setupFiles），规避 rolldown-Vite 8 兼容风险 | 测试管线 |
| `src/test/setup.ts` | 新增：window/location 双 stub（http.ts 与 msw 内部均依赖）+ MSW server 生命周期 | 测试基建 |
| `src/test/server.ts` | 新增：setupServer 复用全量 handlers；`createTestChallenge`/`countRequests` 助手 | 测试基建 |
| `src/api/__tests__/challengesQueries.spec.ts` | 新增：查询契约 20 例（meta/分页/tab/部门/日期/关键词/排序沉底/detail role 与 404/评论排序） | 契约基线 |
| `src/api/__tests__/challengesStateMachine.spec.ts` | 新增：状态机契约 25 例（create 校验与 unshift、score/claim/cancel/progress 转移与错误码） | 契约基线 |
| `src/api/__tests__/challengesVueQuery.spec.ts` | 新增：集成测试 11 例（缓存去重/staleTime/role 入 key/invalidate 前缀语义/响应式 key/生产 client retry 配置） | 缓存行为钉死 |
| `src/api/queryClient.ts` | 新增：QueryClient 单例（staleTime 30s、gcTime 5min、refetchOnWindowFocus:false、4xx ApiError 短路重试） | 全局缓存配置 |
| `src/api/challengeKeys.ts` | 新增：queryKey 工厂（role 入 detail key，前缀结构支持分层失效） | 缓存键约定 |
| `src/composables/useChallenges.ts` | 新增：4 查询 hook（computed 包响应式 key、detail 带 keepPreviousData）+ 5 变更 hook（成功后统一 invalidate detailPrefix + lists） | 挑战模块数据流 |
| `package.json` | 加 `@tanstack/vue-query`、`vitest`；test/test:watch 脚本；check 在 build 前插入 test | 门禁 |
| `src/main.ts` | 挂载 `VueQueryPlugin` | 全局 |
| `src/pages/challenges/Index.vue` | meta/列表换 useQuery；filters 聚合 computed 响应式 key；keyword 防抖保留；删 5 个 watch + 手动 loading；归页 watch `flush:'sync'`；isError 重试分支 | 列表页 |
| `src/pages/challenge-detail/Index.vue` | 详情/评论换 useQuery（roleOverride 入 key）；4 mutation 换 useMutation；**删除硬编码状态机与手抄字段**；isPending/isError/isError 文案；404 时评论查询禁用 | 详情页 |
| `src/pages/challenge-new/Index.vue` | meta 换 useQuery（与列表页共享缓存）；submit 换 useCreateChallenge | 发布页 |
| `docs/plans/refactor/challenges-add-tanstack-cache-plan-progress.md` | 逐里程碑证据记录 | 交付证据 |

**明确不动**：`src/api/http.ts`、`src/mocks/**` 全部、其他模块页面、router、store、`vite.config.ts`、`eslint.config.js`、`tsconfig.json`、`scripts/verify-build.mjs`（diff 计数为 0）。

## 验证证据

| 命令或审查 | 结果 | 备注 |
| --- | --- | --- |
| `npx vitest run` | 通过 | 3 文件 56 例全绿（契约 45 + 集成 11） |
| `npm run check` | 通过 | lint + type-check + test + build + verify-build 全绿，test 已在 build 前 fail fast |
| dev 手测（VITE_ENABLE_MSW=true） | 通过 | 列表筛选/翻页/防抖/tab 切换请求正确；发布后跳转详情；揭榜/取消/评分/进度后 UI 以服务端为准自动刷新；角色切换重取 |
| 缓存命中实证（同一 SPA） | 通过 | ch-3 详情 → 列表（仅 meta+list 请求）→ 再进 ch-3 详情零 detail 请求，即时渲染 |
| 复核修复实证 | 通过 | page 2 切 tab 仅 1 次请求（flush:'sync'）；切角色/揭榜全程 0「加载中」折叠帧（keepPreviousData） |

## 本地 commits

| Commit | 范围 |
| --- | --- |
| `a92b9b5` | M1 测试基建 + 契约测试钉死现状（45 例，零业务改动） |
| `d6d7f38` | M2 接入 vue-query 插件与查询/变更 hooks（含一次性求值 queryKey 缺陷，M3 修复） |
| `0b315b9` | M3 列表页 + 发布页改造（含 queryKey 改 computed 的缺陷修复） |
| `ab9a03c` | M4 详情页改造（删除硬编码状态机与手抄字段） |
| `ed7f8c5` | M5 集成测试补齐（9 例）+ 收尾 |
| `612f735` | 独立复核发现的问题修复（2 Important + 5 Minor） |

## 独立复核

使用独立 general-purpose agent 对 `9f04840..HEAD` 全量审查（对照计划验收条件、逐文件代码正确性、回归残留、工作区保护、测试真实性；自行重跑门禁 54 例确认）。

结论：**无 Critical**，计划 5 条验收条件全部有可复核证据；发现 2 Important + 7 Minor，全部处理（Important-1 列表页 page>1 改过滤双请求 → 归页 watch `flush:'sync'`；Important-2 详情 key 迁移整页折叠 → `placeholderData: keepPreviousData`；Minor-1 meta 失败静默作为已知限制记录；Minor-2~5 代码/测试修复）。修复后浏览器实证 + `npm run check` 56 例全绿。

## 剩余风险与未验证项

- mock 环境 meta 恒成功，meta 失败的错误态未补（列表/发布页静默退化）——留待真实后端联调时补充。
- mock 演示特有：揭榜成功置 roleOverride='claimant' 与 onSuccess invalidate 叠加，会多发一次旧 key 的 GET；正式环境删除 RoleSwitcher 后该路径消失。
- 评论查询在详情 404 时已禁用，但评论自身接口失败仍为静默（无对应 UI 错误分支）——演示态评论无真实写接口，范围外。
- `publishTime` 相对时间在 30s staleTime 缓存期内不刷新——评估文档已记录的已知代价，可接受。
- vitest 门禁已并入 `npm run check`，但 CI（若有）未接入——仓库无 CI 配置。

## 人工验收

验收人：`zhuabo001`

验收证据：用户指示「编写最终record收尾，然后提交并推送到远端分支」（2026-09-04）——即对实施范围与验证证据的明确接受。
