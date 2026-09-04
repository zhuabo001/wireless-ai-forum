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
| M2 接入插件 | 待处理 | queryClient/challengeKeys/main.ts 接线，页面未改、行为不变 | `npm run dev`（VITE_ENABLE_MSW=true）功能回归正常；`npm run check` 通过 | |
| M3 列表页 + 发布页改造 | 待处理 | 双页 useQuery/useMutation 改造完成 | dev 手测筛选/翻页/防抖；列表→发布页 meta 零请求；发布后回列表自动重取；vitest 全绿 | |
| M4 详情页改造 | 待处理 | 详情/评论 useQuery + 4 个 useMutation + 删除硬编码状态机 | dev 手测揭榜/取消/评分/进度/角色切换；vitest 全绿 | |
| M5 集成测试补齐 + 收尾 | 待处理 | challengesVueQuery.spec.ts 约 8 例全绿；最终 record | 全部约 40 例 `npx vitest run` 绿；`npm run check`（含 test）通过；缓存命中证据 | |

允许的状态：`待处理`、`进行中`、`受阻`、`完成`。

## 受保护的工作区变更

- 未跟踪文件不得提交：`.claude/skills/generate-playwright-mcp-testcase/`、`.claude/skills/run-playwright-mcp-testcase/`、`docs/handoff/`、`docs/posts/`、`refactor-chat.txt`、`Bn`、`Bn@endumln`
- 明确不动（计划已列）：`src/api/http.ts`、`src/mocks/**` 全部、其他模块页面、router、store、`vite.config.ts`、`eslint.config.js`、`tsconfig.json`、`scripts/verify-build.mjs`

## 假设与风险

- 事实：仓库当前零测试基建（无 vitest、无 test 脚本、无 spec 文件），已通过 `npm ls`/`package.json` 核实。
- 事实：Vite 8 为 rolldown 内核，测试需独立 `vitest.config.ts` 规避兼容风险。
- 假设：`npx vitest run` 在本环境首次冒烟可通过；若 peer 冲突需锁定兼容版本，记入本文件。
- 未验证项：dev 下 MSW 日志缓存命中的可观测性人工验证（M2-M5 各里程碑手测时补充）。
