# vue-query 数据及时性：机制背景与真实后端路线图

日期：`2026-09-04`

状态：路线图待立项 —— 挑战英雄榜试点（MSW mock）已闭环；本路线图在接入真实后端多人场景时实施。

来源：试点收尾后的两轮问答（`@tanstack/vue-query` 缓存工作原理 × 真实后端下外部变更探测策略），结论整理归档供后续接手者速查。

关联文档：试点计划 `docs/plans/refactor/challenges-add-tanstack-cache-plan.md`、试点进度
`docs/plans/refactor/challenges-add-tanstack-cache-plan-progress.md`、试点记录
`records/challenges-add-tanstack-cache-2026-09-04.md`、评估文档 `docs/todo/tanstack-vue-usage.md`（已完成）。

## 一、背景：接口缓存如何保证数据变化后的及时性

第一轮问答核心：**时间不是主角，失效声明（invalidate）才是。**

### 1.1 staleTime 的真实语义

`staleTime`（试点设 30s）管的从来不是「数据锁定 N 秒不许变」，而是「N 秒内重挂载同 key 能白嫖缓存、不发起请求」。

- **它不是一个倒计时定时器**：页面开着不动、没有任何事件时，即使过了 staleTime 也不会自动发请求（试点未配 `refetchInterval` 轮询，且演示期关掉了 `refetchOnWindowFocus`）。
- staleTime 的三种行为：
  - **30s 内**重挂载同 key → 零请求纯读缓存（即时渲染）；
  - **30s 后**重挂载同 key → 先展示旧值、同时后台重取（旧值不白屏，靠 `placeholderData: keepPreviousData`）；
  - `gcTime`（5min）只决定无观察者后缓存条目在内存中留存多久，**与及时性无关**。

### 1.2 及时性由两个时间戳协作保证

| 机制 | 判定依据 | 触发点 | 试点值 |
| --- | --- | --- | --- |
| 是否「旧」（stale） | `dataUpdatedAt` vs 当前时间 | 数据落库那一刻起计时 | 30s |
| 是否「重取」 | 事件（挂载 / key 变化 / invalidate / 手动 refetch） | 事件发生时查询 stale 与否 | —— |

关键点：**invalidate 会把 `dataUpdatedAt` 归零**，数据瞬间变「旧」，staleTime 被直接绕过；且默认 `refetchType: 'active'` —— 当前正展示该 key 的组件立刻后台重取，完成后数据无缝替换。这保证「数据变化 → UI 及时」：数据变化的宣告来自写路径（mutation 的 `onSuccess`），而非时间流逝。

### 1.3 走一遍「发布难题」的例子

```
发布页提交
  └─ POST /api/challenges → 201
       └─ onSuccess 触发 invalidateQueries(['challenges','list'])
            ├─ ① 前缀匹配：缓存里所有以 ['challenges','list'] 开头的 query
            │   （第1页/第2页/all/my-published/各部门筛选…）全部标 stale
            └─ ② 让正在展示它们的组件立刻后台重取
```

试点 demo 流程中发布后 `router.push` 跳详情、列表页未挂载——① 已把列表缓存标 stale，之后**任意时刻**返回列表页，挂载即发现过期 → 「先显示旧缓存（不白屏）＋后台重取」，新题随即就位。此即「发布后回列表自动重取含新题」的机制来源。

### 1.4 前缀匹配保证「一次失效，全部变体失效」

列表页十几个筛选组合（tab×部门×排序×页）各是一个独立缓存条目，靠 `challengeKeys` 的共享前缀一并作废：

```
list(filters)    → ['challenges', 'list', filters...]   // 各筛选组合共享 'list' 前缀
detail(id, role) → ['challenges', 'detail', id, role]   // visitor/admin/claimant 视角
detailPrefix(id) → ['challenges', 'detail', id]          // 不含 role 的中间前缀
```

- 发布 → invalidate `lists()`（前缀 `['challenges','list']`）→ 全部筛选变体作废，之后切到哪个 tab 都是新的；
- 揭榜/评分/进度 → invalidate `detailPrefix(id)` + `lists()` → 该难题全部 role 视角 + 全部列表同时失效；
- 列表失效**不殃及**详情缓存——不同业务语义不互相误伤。

以上均有集成测试钉死（`src/api/__tests__/challengesVueQuery.spec.ts`）：mutation 成功后同 key 请求计数 1→2；list 前缀失效 detail 计数不变；detailPrefix 失效覆盖全部 role 变体。

### 1.5 边界：谁改了数据，决定是否「及时」

**若数据是本应用之外改的（另一浏览器 / 另一用户 / 后端定时任务），vue-query 毫不知情，开着的老页面不会刷新**，直到某个本地事件（mutation 失效、手动 refetch、重挂载）发生。

原因：缓存一致性是「写方声明制」——vue-query 不可能知道数据变了，除非写入方显式声明污染了哪些查询。mock 单客户端演示里所有写都经过本应用的 mutation，声明完备，因此不存在该问题；真实后端多人场景下必须补「外部变更探测器」，即本文第二部分。

**一句话总结**：读缓存保证「不重复请求 + 即时渲染」，写路径负责「宣告脏数据」；两者缺一，缓存就只剩省流量、丢了正确性。

## 二、路线图：真实后端多人场景的外部变更探测

真实后端带来的本质变化：数据源从「只有我的写操作在改数据」变为「**别人也在改**」。内部写仍走既有 mutation→invalidate 主防线（零额外请求、实时）；需要新增的是**外部写探测器**，按页面易变程度分档配置。

### 2.1 分层防御总览

| 层 | 机制 | 覆盖的变更来源 | 请求成本 | 试点现状 |
| --- | --- | --- | --- | --- |
| L1 | mutation `onSuccess` → invalidate（已有） | 本应用内的写操作 | 精准重取，无额外请求 | ✅ 已落地，保留 |
| L2 | `refetchOnWindowFocus`（+ `refetchOnReconnect`） | 用户切回窗口 / 网络恢复时顺手校验 | 仅事件发生时、且仅对 stale 查询 | ⚠️ 演示期关闭，接真实后端恢复 |
| L3 | `refetchInterval` 选择性轮询 | 他人持续写入的「易变面」（揭榜进度、评分、榜单） | 每周期每页面 1 请求 | 未配置，接真实后端按表启用 |
| L4 | WebSocket/SSE 推送 + 主动 invalidate | 所有外部变更 | 长连接 + 变更消息 | 范围外，轮询跟不上时再立项 |

### 2.2 L2：refetchOnWindowFocus —— 先开它

最便宜、最贴合人性的探测器：用户切走再切回窗口的那一刻，正是他重新「看」数据的时刻。

- **默认 `true` 只对 stale 查询重取**（`'always'` 才无视新鲜度强刷）→ `staleTime: 30s` 天然是节流阀：切走 10s 回来零请求，切走 2 分钟回来重取一次。
- 试点 mock 期特意设 `refetchOnWindowFocus: false` 是为了测试请求数可预测；真实后端应恢复。
- 风险：页面挂多个查询、切回瞬间全部已过期 → 并发风暴。抑制用函数形态加粗粒度闸门：

```ts
// src/api/queryClient.ts（真实后端形态示意）
refetchOnWindowFocus: (query) => {
  // staleTime 之外的附加闸门：只有超过 60s 未更新的查询才在聚焦时重取
  return Date.now() - query.state.dataUpdatedAt > 60_000
},
```

- 同族免费探测器：`refetchOnReconnect`（断网恢复默认开）。
- **局限**：只覆盖「会切窗口的人」；一直盯着页面的人永远等不到这阵风 → 需要 L3。

### 2.3 L3：refetchInterval 选择性轮询 —— 给易变面装心跳

轮询是主动探测器，**按页面的易变程度分档**，不全局开（后台请求税：10s 轮询挂 10 分钟 = 60 请求/页面）。映射表（数字为建议起点，接真实后端后按请求曲线校准）：

| 数据面 | 易变来源 | 策略 | 理由 |
| --- | --- | --- | --- |
| `meta` | 几乎不变 | **不轮询**（保持 staleTime: Infinity） | 靠页面重进即可 |
| 列表 `all` | 别人发布/揭榜 → 条数/状态变 | 30s，**仅当结果含非终态条目** | 全员 closed 的榜不值得盯 |
| 列表 `my-published`/`my-claimed` | 只有自己写 | **不轮询** | mutation invalidate 已完备 |
| 详情 `solving`/`scoring` | 揭榜人更新进度、评委打分 | **10s** | 「多人协作进行时」，别人一动手时间线就变 |
| 详情 `open`/`closed` | open 仅 claimCount 缓慢累积；closed 终态 | 不轮询（靠 focus + invalidate） | 终态无需心跳 |

v5 的 `refetchInterval` 支持函数形态——按查询当前数据决定轮询与否/周期，且**只在有活跃观察者时计时**（页面关着不烧请求）：

```ts
// src/composables/useChallenges.ts（真实后端形态示意，status 取自 detail.challenge）
refetchInterval: (query) => {
  const status = query.state.data?.challenge.status
  return status === 'solving' || status === 'scoring' ? 10_000 : false
},
```

```ts
// 列表页：结果里只要还有非终态条目就 30s 心跳，全终态自动停跳
refetchInterval: (query) => {
  const list = query.state.data?.list ?? []
  return list.some(item => item.status !== 'closed') ? 30_000 : false
}
```

补充细节：

- 后台标签页默认**不**轮询（浏览器会节流 timer）；榜单页想「切走再回来就是新的」需 `refetchIntervalInBackground: true`。
- 轮询与 invalidate 触发的是同一条重取通道、写同一份缓存，不存在双源打架。

### 2.4 放大器：让探测器变便宜（真实后端配合项）

轮询的成本瓶颈不是请求数，是**每次全量拉数据**。两项后端配合可把成本压到趋近零：

1. **ETag / Last-Modified 条件请求**：列表/详情响应带 ETag、支持 `If-None-Match` → 轮询多为 304 空 body，高频心跳变得几乎免费；
2. **轻量版本探测端点**（排除 WebSocket 后最接近实时的折中）：独立的 `/api/challenges/version` 微端点 5s 轮询，只比较版本号，变化时才 invalidate 对应 key 触发真实数据重取——小额请求换近实时，无需重写后端为推送架构。

### 2.5 落地顺序

1. **L2 先行**：`refetchOnWindowFocus` 恢复 true（可加 60s 函数闸门）。一行配置，观察几天请求曲线；
2. **L3 局部轮询**：按 2.3 表给 detail（10s）与列表（30s 条件式）接函数形态 `refetchInterval`——只动 `src/composables/useChallenges.ts`，页面零改动（试点把轮询选项收进 composable 的红利：mock 换真实 http 时数据流不动）；
3. **度量再调参**：用 Network 面板统计每分钟每页面请求数，对照后端 QPS 预算调 staleTime/interval，不拍脑袋定数；
4. **mock 阶段先验证**：给 MSW 加测试用「他人突变」通道（定时改某题状态的调试端点），证明兜底网确实能在周期内捞回外部变更——避免接真后端才发现探测器无效。

### 2.6 一句话收束

内部写靠失效（已有），外部写靠探测——探测粒度按「这页面别人多久动一次数据」分档：切窗口是免费的被动探测所以全开，轮询只发给 `solving/scoring` 这类「正被多人操作」的面，`closed`、`my-*`、`meta` 一律不缴后台请求税；等外部写频繁到轮询跟不上，再上 WebSocket 主动推送（L4）。
