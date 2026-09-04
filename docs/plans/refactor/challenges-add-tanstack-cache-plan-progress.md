# 挑战英雄榜试点接入 vue-query（TDD 钉死接口行为） 进度

计划：`docs/plans/refactor/challenges-add-tanstack-cache-plan.md`

任务等级：`L2`

范围：`vitest.config.ts`、`src/test/**`、`src/api/__tests__/**`、`src/api/challengeKeys.ts`、
`src/api/queryClient.ts`、`src/composables/useChallenges.ts`、`package.json`、`src/main.ts`、
`src/pages/challenges/Index.vue`、`src/pages/challenge-detail/Index.vue`、`src/pages/challenge-new/Index.vue`

验收条件：见计划「验收条件」章节（共 5 条）

| 里程碑 | 状态 | 预期输出 | 验证证据 | 备注 / 阻塞项 |
| --- | --- | --- | --- | --- |
| M1 测试基建 + 契约测试钉死现状 | 完成 | vitest.config.ts、src/test/*、查询 20 例 + 状态机 25 例（共 45 例，覆盖计划约 32 例的全部场景）针对未改动现状全绿；scripts 加 test 并入 check | `npx vitest run` → 45 passed；`npm run lint` 通过；`npm run type-check` 通过；`npm run check` 全绿（含 build + verify-build）；零业务代码改动（仅新增 vitest.config.ts / src/test/** / src/api/__tests__/** / package.json script） | msw 内部用裸标识符 `location` 归一化 handler 相对路径，仅 stub `window.location` 不够，需同时 stub `globalThis.location`（见 src/test/setup.ts 注释），此为本里程碑排查得到的环境事实，已记录 |
| M2 接入插件 | 完成 | 新增 `src/api/queryClient.ts`（staleTime 30s/gcTime 5min/refetchOnWindowFocus:false/4xx 短路重试）、`src/api/challengeKeys.ts`（role 入 detail key）、`src/composables/useChallenges.ts`（4 查询 hook + 5 变更 hook）；`main.ts` 挂 `VueQueryPlugin`；三页 Index.vue 未改、仍走裸 fetch | dev 手测（VITE_ENABLE_MSW=true）：列表页/详情页(ch-3)/发布页均正常渲染，MSW 日志显示请求照常发出（页面未接入 useQuery，行为不变，符合里程碑预期）；`npm run check` 全绿（45 例测试 + lint + type-check + build + verify-build） | |
| M3 列表页 + 发布页改造 | 完成 | 列表页 meta/列表换 useQuery，filters 聚合为 computed 驱动响应式 queryKey，删五个 watch + resetPageAndLoad，改为「防抖写 debouncedKeyword → 单个 watch 归页」，isLoading/isError 替代手动 loading；发布页 meta 换 useQuery，submit 换 useCreateChallenge | dev 手测（VITE_ENABLE_MSW=true，5173 端口）：tab 切换 all→my-published→all 请求正确（my-published 空列表，界面显示空态）；keyword=MIMO 触发防抖后单次请求；列表页跳转发布页，Network 面板确认 `/api/challenges/meta` 仅 1 次请求未重复（同 queryKey 命中缓存）；发布难题后 POST 201 + 自动跳转详情页成功渲染；`npx vitest run` 45 例保持全绿；`npm run check` 全绿 | 联合发现并修正一个改造中的缺陷：`useChallengeList`/`useChallengeDetail`/`useChallengeComments` 最初把 `queryKey` 传成一次性求值的数组而非 `computed`，导致 key 不随 filters/id/role 变化响应式更新；已改为 `computed(() => challengeKeys.xxx(...))`，此为 M2 遗留、M3 验证时发现的问题，已在本里程碑内修复（src/composables/useChallenges.ts） |
| M4 详情页改造 | 完成 | 详情/评论换 useQuery（roleOverride ref 入 key，切换角色自动重取），4 个 mutation 换 useMutation；删除 105-178 行手动抄字段与硬编码状态机；isPending/isError 替代 challenge===null 双关 | dev 手测（VITE_ENABLE_MSW=true）全路径通过（chrome-devtools 实证）：ch-4 揭榜→自动切 claimant 视角重取（POST claim 后 2 次 GET，UI 显示 solving+揭榜人周明轩）；更新进度 50%→时间线 current 自动刷新；取消揭榜→退回 visitor+状态回 open+进度 0+时间线保留历史并追加取消记录；切换超管角色触发重取（GET 请求可见）；ch-2 评分 500 分→POST score 后自动 GET 重取，badge 评分中→揭榜中、时间线追加评定记录带理由。硬编码状态机已删除，所有状态以服务端响应为准；`npx vitest run` 45 例保持全绿；`npm run check` 全绿 | |
| M5 集成测试补齐 + 收尾 | 完成 | `src/api/__tests__/challengesVueQuery.spec.ts` 9 例（同 key 去重、staleTime 内零请求、staleTime=0 重取、role 独立缓存、mutation→invalidate 自动重取、list 失效不影响 detail、detailPrefix 失效全部 role 变体、响应式 queryKey、cancel 冒烟）全绿 | `npx vitest run` → 3 文件 54 例全绿（契约 45 + 集成 9）；`npm run check` 全绿（lint + type-check + test + build + verify-build）；dev 缓存命中实证（同一 SPA 导航，MSW 日志）：ch-3 详情 → 返回列表（仅 meta+list 请求、无 detail 重取）→ 再进 ch-3 详情（**零 detail 请求**，缓存命中即时渲染） | |

允许的状态：`待处理`、`进行中`、`受阻`、`完成`。

## 受保护的工作区变更

- 未跟踪文件不得提交：`.claude/skills/generate-playwright-mcp-testcase/`、`.claude/skills/run-playwright-mcp-testcase/`、`docs/handoff/`、`docs/posts/`、`refactor-chat.txt`、`Bn`、`Bn@endumln`
- 明确不动（计划已列）：`src/api/http.ts`、`src/mocks/**` 全部、其他模块页面、router、store、`vite.config.ts`、`eslint.config.js`、`tsconfig.json`、`scripts/verify-build.mjs`

## 假设与风险

- 事实：仓库当前零测试基建（无 vitest、无 test 脚本、无 spec 文件），已通过 `npm ls`/`package.json` 核实。
- 事实：Vite 8 为 rolldown 内核，测试需独立 `vitest.config.ts` 规避兼容风险。
- 假设：`npx vitest run` 在本环境首次冒烟可通过；若 peer 冲突需锁定兼容版本，记入本文件。
- 未验证项：dev 下 MSW 日志缓存命中的可观测性人工验证（M2-M5 各里程碑手测时补充）。
