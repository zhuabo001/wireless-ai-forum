# 难题英雄榜 Vue 页面 进度

计划：`docs/plans/challenge-heroes-pages-plan.md`

任务等级：`L2`

范围：`src/types/pageDesign/challengeHeroes.ts`、`src/data/pageDesign/challengeHeroes.ts`、
`src/api/challenges.ts`、`src/api/http.ts`、`src/mocks/handlers/challenges.ts`、
`src/mocks/handlers/index.ts`、`src/pages/challenges/`、`src/pages/challenge-new/`、
`src/pages/challenge-detail/`、`src/components/RichTextEditor.vue`、`src/components/PostContent.vue`、
`src/components/Pagination.vue`、`src/components/comments/`、`src/components/ui/IconRenderer.vue`、
`src/utils/challenges.ts`、`src/router/index.ts`、`src/data/navigation.ts`、
`scripts/verify-build.mjs`、forum 两页中被提升组件的 import 行。

验收条件：见计划「验收条件」1–5。

| 里程碑 | 状态 | 预期输出 | 验证证据 | 备注 / 阻塞项 |
| --- | --- | --- | --- | --- |
| M1 类型与种子数据 | 完成 | 类型与数据文件 | `vue-tsc --noEmit` 通过 | |
| M2 API 层与 MSW handlers | 完成 | challenges API（JSDoc）+ handler 注册 | `vue-tsc --noEmit` 通过 | http.ts 增加 `post` |
| M3 共享组件提升 | 完成 | RichTextEditor / PostContent / Pagination / comments 组件族迁移 | `npm run lint` 通过 | forum 页仅改 import |
| M4 列表页 | 完成 | /challenges 可用 | 浏览器快照：三 tab、部门/日期/搜索、三榜单、分页均渲染 | |
| M5 发布页 | 完成 | /challenges/new 可用 | 浏览器端到端：填表 → POST → 跳转新详情页 | |
| M6 详情页 | 完成 | /challenges/:id 可用 | 浏览器端到端：评分调分、揭榜、进度更新均联动 | |
| M7 路由与导航 | 完成 | 3 条路由 + 导航项 | 浏览器快照导航栏含「难题英雄榜」且激活 | |
| M8 验证与收尾 | 完成 | `npm run check` 通过 | 已通过；独立复核完成（无 Critical），8 条 Minor 已修复并复跑门禁通过 | record：`records/challenge-heroes-pages-2026-09-03.md` |
| M9 设计迭代（分数总榜切换 + 取消揭榜） | 完成 | 设计稿与 Vue 页面同步 | 浏览器端到端：近期/总榜切换、取消揭榜→状态退回揭榜中、进度清零、重新揭榜均联动 | 新增 `POST /api/challenges/:id/cancel-claim` 与 `totalScoreRank` |

允许的状态：`待处理`、`进行中`、`受阻`、`完成`。

## 受保护的工作区变更

- 未跟踪文件 `.claude/skills/`、`docs/handoff/`、`docs/posts/`、`refactor-chat.txt`、`Bn*`：与本任务无关，不得提交。

## 假设与风险

- 事实：工程已具备 MSW（`src/mocks`，dev 下 `VITE_ENABLE_MSW=true` 启用）；既有页面均直接 import
  `src/data` 而未经 API 层；`http.ts 原`仅有 `get`。
- 假设：本特性页面全部经 API 层取数；`fetchChallengeDetail` 的 `role` 参数仅 mock 期演示权限用。
- 已澄清：状态徽章重复问题——`scoring` 与 `open` 对外均显示「揭榜中」，「评分中」只出现在分值槽位（与设计稿一致）。
- 未验证项：多人揭榜模型按单揭榜人实现（已被揭榜时「我要揭榜」隐藏，接口返回 409），待业务确认。
