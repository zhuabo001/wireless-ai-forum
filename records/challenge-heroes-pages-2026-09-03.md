# 难题英雄榜 Vue 页面

日期：`2026-09-03`

计划：`docs/plans/features/challenge-heroes-pages-plan.md`

进度：`docs/plans/features/challenge-heroes-pages-plan-progress.md`

任务等级：`L2`

## 目标

按 `page-design/challenge-heroes/` 三页设计稿实现难题英雄榜 Vue 页面（列表/发布/详情），
数据经 MSW mock 接口获取（本特性是工程内首个真正消费 `src/api` + `src/mocks` 体系的页面），
接口函数以 JSDoc 描述作用、传参与返回值。

## 变更文件

| 文件 | 变更 | 影响 |
| --- | --- | --- |
| `src/types/pageDesign/challengeHeroes.ts` | 新增：难题领域类型（状态机、角色、榜单、时间线等） | 无 |
| `src/data/pageDesign/challengeHeroes.ts` | 新增：种子数据（12 条难题、三榜单、ch-3 完整详情与评论） | 无 |
| `src/api/challenges.ts` | 新增：8 个接口函数，全部 JSDoc | 无 |
| `src/api/http.ts` | 新增 `post()`，错误解析抽为 `toApiError`；`get()` 行为不变 | 全站 API 层（行为兼容） |
| `src/mocks/handlers/challenges.ts` | 新增：列表/meta/详情/评论 GET 与 create/claim/score/progress POST，运行时可变状态 | 无 |
| `src/mocks/handlers/index.ts` | 注册 challengeHandlers | 无 |
| `src/pages/challenges/` | 新增列表页（Index、Toolbar、List、Item、Sidebar） | 无 |
| `src/pages/challenge-new/Index.vue` | 新增发布页（五要素 + 难度自评 + 富文本） | 无 |
| `src/pages/challenge-detail/` | 新增详情页（Index、Header、ProgressPanel、ScoreDialog、ProgressDialog、FloatingActions、RoleSwitcher） | 无 |
| `src/utils/challenges.ts` | 新增：状态徽章映射与选项名解析 | 无 |
| `src/components/RichTextEditor.vue` | 自 forum-new-topic 迁入，新增可选 `placeholder` prop（默认值不变） | forum-new-topic 仅 import 变化 |
| `src/components/PostContent.vue`、`src/components/Pagination.vue`、`src/components/comments/*` | 自 forum 页迁入，内容 0 改动 | forum 两页仅 import 变化 |
| `src/components/ui/IconRenderer.vue` | 纯增量新增 14 个图标 | 无 |
| `src/router/index.ts`、`src/data/navigation.ts` | 新增 3 条路由与「难题英雄榜」导航项 | 导航新增一项 |
| `scripts/verify-build.mjs` | 动态边断言放宽为沿静态闭包检查（共享 chunk 适配），新增三页断言 | 构建守卫（有注释说明） |

## 验证证据

| 命令或审查 | 结果 | 备注 |
| --- | --- | --- |
| `npm run check`（lint + vue-tsc + build + verify-build） | 通过 | 复核修复后重跑亦通过 |
| 浏览器：/challenges 列表页 | 通过 | tab、部门/日期/搜索过滤、三榜单、分页均渲染自 MSW 数据 |
| 浏览器：发布难题端到端 | 通过 | 填表 → POST 201 → 跳转新详情，呈现「评分中 + 揭榜中」 |
| 浏览器：超管评分端到端 | 通过 | 800 → 500，头部徽章与时间线同步更新 |
| 浏览器：揭榜 + 更新进度端到端 | 通过 | 揭榜后角色切换为 claimant，进度更新联动 75% 与时间线 |
| 浏览器控制台 error/warn | 通过 | 详情页无 error/warn |
| 独立复核（general-purpose 代理） | 通过 | 无 Critical；Important 1 项（根目录既有垃圾文件不得入库）；Minor 9 项中 8 项已修复，1 项（verify-build 弱化）为有意保留 |

## 本地 commits

| Commit | 范围 |
| --- | --- |
| 有意跳过 | 治理契约动作矩阵：普通实现请求默认不允许创建本地 commit，待用户明确授权后提交 |

## 独立复核

使用独立 general-purpose 代理复核全部 diff（含重命名），结论：无 Critical/Important 级 bug；
forum 三页仅 import 行变化；验收条件 5 条全部落实。Minor 修复：过滤变化重复请求、详情 404 无错误态、
角色切换后点赞状态不一致、timeline 下标脆弱假设、closed 状态评分矛盾、分值上限未校验、
claimCount 不同步、commentCount 与评论数不一致。

## 剩余风险与未验证项

- 多人揭榜模型：当前按单揭榜人实现（已揭榜后「我要揭榜」隐藏，重复揭榜返回 409），待业务确认。
- `fetchChallengeDetail` 的 `role` 查询参数与 RoleSwitcher 组件仅 mock 期演示权限用，正式环境应由登录态取代。
- 评论提交/回复/加载更多为 toast 演示（验收未要求）。
- 根目录 `Bn`、`Bn@endumln`、`refactor-chat.txt` 疑似垃圾文件，未删除（用户文件，需用户确认）。

## 设计迭代（Vue 同步）

设计稿先改后 Vue 同步（`page-design/challenge-heroes/` 两处设计 + 本实现）：

| 迭代 | 内容 | 验证 |
| --- | --- | --- |
| 分数总榜切换 | 列表页分数榜卡片：近期（+N 分）↔ 总榜（累计分 · 揭榜 N 题）分段切换 | 浏览器端到端：总榜行内容与激活态正确 |
| 取消揭榜 | 详情页揭榜人右侧操作栏新增「取消揭榜」（确认弹窗 + 必填原因留痕）；取消后状态退回揭榜中、进度清零、current→done 追加时间线记录、隐藏揭榜人卡片、开放「我要揭榜」 | 浏览器端到端：空原因拦截、取消联动、重新揭榜可再次认领均通过；控制台无 error/warn |

接口与数据变更：`totalScoreRank` 并入 meta 响应；新增 `POST /api/challenges/:id/cancel-claim`
（reason 必填；无揭榜人 / 已结题 409；claimCount 减一并联动列表）。API 文档已同步
（`docs/api/challenges-api.md`）。`npm run check` 通过。

## 人工验收

验收人：`<待用户>`

验收证据：待用户确认。
