# 难题英雄榜接口文档

来源：`src/mocks/handlers/challenges.ts`（MSW mock）与 `src/api/challenges.ts`（前端调用层）。

本文档描述难题英雄榜特性消费的 mock 接口。当前无真实后端，dev 下通过 `VITE_ENABLE_MSW=true` 由 MSW 拦截；正式联调时前端无需改动，
直接替换真实后端实现同名接口即可。所有接口均为 JSON，错误体统一为 `{ "message": string }`。

## 通用约定

- 基础路径：`/api/challenges`
- 状态机：`scoring` 评分中 → `open` 揭榜中 → `solving` 解题中 → `closed` 已结题
- 分页：返回 `PagedResult<T>`，结构为 `{ list, total, page, pageSize }`
- 错误：非 2xx 时响应体含 `message` 字段；前端封装为 `ApiError`（status + message）

## 类型定义

### ChallengeItem（列表条目）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 难题 id |
| title | string | 题目名称 |
| category | string | 问题类别 id（见 meta 接口 `categoryOptions`） |
| department | string | 所属部门 id |
| score | number \| null | 悬赏分值；null 表示评分中（超管未评定） |
| status | string | `scoring` / `open` / `solving` / `closed` |
| author | ChallengeUser | 发布者 |
| publishTime | string | 相对时间（如「2小时前」） |
| publishDate | string | 发布日期 `YYYY-MM-DD`，用于日期筛选 |
| claimCount / viewCount / likeCount | number | 揭榜数、浏览数、有用数 |
| claimedBy | string? | 已揭榜时存在，揭榜人姓名 |

### ChallengeDetail（详情）

在列表字段基础上去掉 `publishTime`、`claimCount`，新增：`difficulty`（light/normal/hard/critical）、`publishDate`（详情文案）、
`commentCount`、`claimant?`、`progressPercent`、`timeline[]` 等。

## 接口一览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/challenges` | 分页查询难题列表 |
| GET | `/api/challenges/meta` | 页面元数据（文案、tab、选项、三榜单） |
| GET | `/api/challenges/:id` | 难题详情 |
| GET | `/api/challenges/:id/comments` | 分页评论 |
| POST | `/api/challenges` | 发布难题 |
| POST | `/api/challenges/:id/claim` | 揭榜 |
| POST | `/api/challenges/:id/score` | 超管评分 |
| POST | `/api/challenges/:id/progress` | 揭榜人更新进度 |

---

## 1. GET /api/challenges — 分页查询难题列表

**查询参数**（均可选，组合生效；处理顺序：tab/部门/日期过滤 → 关键词 → 排序 → 分页）

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tab | string | `all` 全部 / `my-published` 我的发布 / `my-claimed` 我的揭榜 |
| department | string | 部门 id；缺省为全部部门 |
| sort | string | `latest` 最新发布（默认）/ `highest-score` 悬赏最高 / `most-claimed` 最多揭榜 |
| date | string | 发布日期 `YYYY-MM-DD`，按日精确过滤 |
| keyword | string | 模糊匹配标题与发布人 |
| page / pageSize | number | 默认 1 / 10 |
| keyword | string | 匹配标题与发布人，大小写不敏感 |

**返回**：`PagedResult<ChallengeItem>`。评分中的难题 `score` 为 null；按悬赏排序时评分中沉底。

## 2. GET /api/challenges/meta

返回：`{ meta, tabs, categoryOptions, departmentOptions, difficultyOptions, sortOptions, sidebar }`，其中 sidebar 含三榜单。

## 3. GET /api/challenges/:id

查询参数 `role`：visitor / publisher / claimant / admin（仅 mock 期演示权限用）。

返回：`{ challenge, contentHtml, viewerRole, currentUser }`。404 时抛出错误。

## 4. GET /api/challenges/:id/comments

参数：`sort`（hottest/latest）、`page`、`pageSize`。
返回：`PagedResult<Comment>` + `sortOptions`。

## 5. POST /api/challenges

请求体：`{ title, category, department, difficulty, contentHtml }` — 五个字段全部必填；**无 score 字段**（分值由超管评定）。
201 返回 `{ id }`。

## 6. POST /api/challenges/:id/claim

无请求体。已揭榜返回 409；成功返回 `{ claimant, timeline }`，状态变 `solving`。

## 7. POST /api/challenges/:id/score

仅超管。请求体 `{ score, reason }`（理由必填，写入时间线）；结题后 409。

## 8. POST /api/challenges/:id/progress

揭榜人。请求体 `{ stage, percent, note }`；返回 `{ progressPercent, timeline }`。
