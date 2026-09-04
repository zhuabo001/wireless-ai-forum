# TanStack Query（vue-query）接口级缓存评估

日期：`2026-09-04`

状态：✅ 已完成 —— 评估结论经挑战英雄榜试点落地验证（2026-09-04，L2 闭环）。试点计划/进度/记录见
`docs/plans/refactor/challenges-add-tanstack-cache-plan*.md` 与 `records/challenges-add-tanstack-cache-2026-09-04.md`；
后续事项（其余模块推广、真实后端外部变更探测）见 `docs/todo/vue-query-real-backend-roadmap.md`。

## 背景

当前工程存在大量页面跳转后接口重新调用的情况。数据获取形态为裸 `fetch` 封装
（`src/api/http.ts` 的 `get`/`post`）+ 页面 `onMounted` 手动调用（如
`src/pages/challenge-detail/Index.vue` 每次进详情页都 `fetchChallengeDetail`），没有任何缓存层。

页面缓存（keep-alive）保的是组件状态（滚动位置、表单输入）；接口级缓存保的是数据。两者正交，可叠加。

## 结论

| 问题 | 答案 |
| --- | --- |
| 能否用 tanstack-vue 做接口级缓存 | 能，`@tanstack/vue-query`，与现有 `http.ts` 零冲突 |
| 能否搭配 MSW 演示缓存效果 | 能，分层互不干扰，现有 handlers 不用动 |
| 能否搭配 axios 用于真实后端 | 能，queryFn 只要求返回 Promise，axios/fetch/ky 任意 HTTP 客户端均可 |

## 1. TanStack Query 做接口级缓存

`@tanstack/vue-query` 恰好填补当前缺失的缓存层：

- **key 级缓存**：`useQuery({ queryKey: ['challenge', id], queryFn: () => fetchChallengeDetail(id) })`，
  列表 → 详情 → 返回 → 再进同一详情，在 `staleTime` 内零请求直接命中缓存。
- **请求去重**：多个组件同时请求同一 key 只发一次网络请求。
- **失效联动**：揭榜/更新进度/评分这类写操作用 `useMutation`，成功后
  `queryClient.invalidateQueries(['challenge', id])`，下次进入自动重取——解决"操作后数据不新鲜"的问题。

**接入点**：`http.ts` 的 `get`/`post` 不需要改动，只需在 `main.ts` 挂 `VueQueryPlugin`，
然后逐页面把 `onMounted` 手动调用换成 `useQuery`。可以先在挑战英雄榜试点，再推广。

### 本工程特有的注意点

1. **queryKey 必须包含 mock 的 `role` 参数**（详情接口返回因 role 而异），
   否则切换角色演示时会吃到别的角色的缓存。
2. 列表项的 `publishTime` 是「2小时前」这类相对时间，缓存期内不会刷新——
   可接受的代价，或给列表设较短的 `staleTime`。

## 2. 搭配 MSW 演示缓存效果

vue-query 工作在 fetch **之上**，MSW 拦截在 fetch **之下**，两者互不感知，现有
`src/mocks/handlers/` 零改动。MSW 恰好让缓存效果**可观测**：

- 命中缓存时 fetch 根本不会发出，MSW handler 不触发——打开 MSW 请求日志或浏览器 Network 对比
  「首次进入有请求 / 返回再进无请求」，缓存效果一目了然。
- 可给 mock handler 加 300~500ms 延迟，让「缓存命中秒开 vs 未命中转圈」的对比更有体感。
- 装上 `@tanstack/vue-query-devtools`，可实时查看 query 缓存树、fresh/stale 状态。

提醒：MSW 只在 `VITE_ENABLE_MSW=true` 的 dev 环境启用，但 vue-query 的缓存与后端真假无关——
将来换真实后端，缓存层原样保留，这正是「mock 先行」路线想要的效果。

## 3. 搭配 axios 用于真实后端

可以。vue-query 对 HTTP 客户端无要求，`queryFn`/`mutationFn` 只要求返回 Promise——
axios、fetch、ky 甚至 SDK 方法都可以。axios 用户常见分工：

- **axios 实例负责传输层**：baseURL、拦截器、鉴权 header、错误归一化。
- **vue-query 负责数据层**：缓存、去重、失效、loading/error 状态。

即把现有 axios 封装的请求函数直接塞进 `queryFn` 即可，两层职责不重叠。
对本工程的意义：将来从 MSW 切真实后端时，无论后端走 fetch 还是 axios，vue-query 层都不受影响。

## 落地建议

1. 安装 `@tanstack/vue-query` + `@tanstack/vue-query-devtools`，`main.ts` 挂 `VueQueryPlugin`
2. 挑战英雄榜模块试点：列表/详情/评论换 `useQuery`，写操作换 `useMutation` + 失效联动
3. 验证缓存效果（MSW 日志 + devtools）
4. 通过后推广至其余模块（forum、courses、practices、intelligence、market 等）

## 落地验证记录（2026-09-04）

- ✅ 1~3 已在挑战英雄榜试点全部落地（L2 闭环，56 例测试全绿 + `npm run check` 门禁通过），
  交付证据见上文链接的计划/进度/记录三文档。唯一偏差：未引入 `vue-query-devtools`
  （用户确认以「测试断言请求次数 + MSW 日志」替代，见计划 Context）。
- ⏳ 4 推广至其余模块 —— 未实施，试点记录列为后续推广项。
- 📌 评估未覆盖的新议题：真实后端多人场景下「外部变更探测」（mock 单客户端不存在、接真后端必现），
  设计路线图已整理于 `docs/todo/vue-query-real-backend-roadmap.md`。
