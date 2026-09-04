# 难题英雄榜 Vue 页面实施计划

来源：`page-design/challenge-heroes/` 三页设计稿（列表 / 发布 / 详情），对应 PR #32。

## 目标

- 以 Vue 3 + TS 实现难题英雄榜三个页面，路由与论坛等 tab 平级。
- 数据经由 MSW mock 接口获取（工程已有 `src/api` + `src/mocks` 体系，但既有页面均未消费；
  本特性为首个真正走 API 层的页面），接口函数以 JSDoc 描述作用、传参、返回值。
- 视觉与交互沿用设计稿与论坛页的 Tailwind 令牌。

## 验收条件

1. `/challenges` 列表页：tab（全部/我的发布/我的揭榜）、部门下拉、排序、日期、搜索过滤，
   右侧浏览榜/有用榜/近期分数榜，分页；数据来自 `/api/challenges*`。
2. `/challenges/new` 发布页：题目、问题类别、所属部门、难度自评、富文本正文（wangeditor，
   无 Markdown 切换）；提交走 `POST /api/challenges`。
3. `/challenges/:id` 详情页：头部 tag + 「我要揭榜」「评分」按钮、揭榜人信息卡、
   左侧垂直揭榜进度组件、评论区（形式与帖子详情一致）、右侧浮动操作栏
   （置顶/删除/编辑/认为有用/回到顶部）按角色显隐。
4. 评分（超管）、更新进度（揭榜人）、揭榜操作均调用对应 mock 接口并联动界面。
5. `npm run check` 通过。

## 里程碑

| # | 里程碑 | 主要产物 |
| --- | --- | --- |
| M1 | 类型与种子数据 | `src/types/pageDesign/challengeHeroes.ts`、`src/data/pageDesign/challengeHeroes.ts` |
| M2 | API 层与 MSW handlers | `src/api/challenges.ts`（JSDoc）、`src/api/http.ts` 增加 `post`、`src/mocks/handlers/challenges.ts`、handlers 注册 |
| M3 | 共享组件提升 | `RichTextEditor` → `src/components/`；评论组件族 → `src/components/comments/`（forum 两处引用同步更新） |
| M4 | 列表页 | `src/pages/challenges/`（Index、Toolbar、List、Item、Sidebar、RankCard、Pagination） |
| M5 | 发布页 | `src/pages/challenge-new/Index.vue`（含难度自评、部门/类别选择、复用 RichTextEditor） |
| M6 | 详情页 | `src/pages/challenge-detail/`（Index、Header、ClaimantCard、ProgressPanel、ScoreDialog、ProgressDialog、FloatingActions、MobileActions、RoleSwitcher） |
| M7 | 路由与导航 | `src/router/index.ts`、`src/data/navigation.ts` 增加「难题英雄榜」 |
| M8 | 验证与收尾 | `npm run check`、progress/record 记录 |

## 关键设计决策

- 状态机：`scoring`（评分中）→ `open`（揭榜中）→ `solving`（解题中）→ `closed`（已结题）。
- 分值：`score: number | null`，`null` 即评分中；仅超管经 `POST /api/challenges/:id/score` 定分/调分。
- 角色：详情接口返回 `viewerRole`（`visitor | publisher | claimant | admin`），页面据此显隐操作。
- 复用：评论类型复用 `@/types/pageDesign/forumPostDetail`；评论组件族与 RichTextEditor 提升到
  `src/components/` 供两页共用（forum 页仅改 import 路径，无行为变化）。
- 提交/动作类接口用 `post`；`http.ts` 新增带 JSDoc 的 `post` helper。

## 范围外

- 真实后端、鉴权；置顶/删除/编辑的实际落库（演示提示）；首页聚合区块接入。
