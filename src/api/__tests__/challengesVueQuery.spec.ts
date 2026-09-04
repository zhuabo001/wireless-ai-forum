import { describe, it, expect, vi } from 'vitest'
import { createApp, effectScope, nextTick, ref, type EffectScope } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import {
  useCancelChallengeClaim,
  useChallengeDetail,
  useChallengeList,
  useClaimChallenge,
} from '@/composables/useChallenges'
import { countRequests, createTestChallenge } from '@/test/server'
import type { ChallengeListQuery } from '@/api/challenges'
import type { ChallengeViewerRole } from '@/types/pageDesign/challengeHeroes'

/**
 * vue-query 集成测试环境：每个用例独立的 QueryClient + Vue app（provide client），
 * hook 在 effectScope + app.runWithContext 中创建（模拟组件 setup 上下文）。
 */

function createContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 30_000,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
      },
    },
  })
  const app = createApp({})
  app.use(VueQueryPlugin, { queryClient })
  return { queryClient, app }
}

interface ScopeHandle<T> {
  scope: EffectScope
  value: T
}

/** 在 app 上下文 + 活跃 effect scope 内运行 hook，返回结果与 scope（用于卸载重挂） */
function runInApp<T>(app: ReturnType<typeof createApp>, factory: () => T): ScopeHandle<T> {
  const scope = effectScope()
  let value!: T
  scope.run(() => {
    value = app.runWithContext(factory)
  })
  return { scope, value }
}

const detailPath = (id: string) => (url: URL) => url.pathname === `/api/challenges/${id}`
const listPath = (url: URL) => url.pathname === '/api/challenges'

/** 等一轮 microtask，让 invalidate 触发的后台重取有机会发出请求 */
async function flushAsync(): Promise<void> {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 20))
}

describe('vue-query 缓存行为（集成）', () => {
  it('同 key 并发挂载去重：只发一次请求', async () => {
    const { app } = createContext()
    const counter = countRequests(detailPath('ch-3'))
    const a = runInApp(app, () => useChallengeDetail('ch-3', undefined))
    const b = runInApp(app, () => useChallengeDetail('ch-3', undefined))
    await vi.waitFor(() => expect(a.value.data.value).toBeTruthy())
    await vi.waitFor(() => expect(b.value.data.value).toBeTruthy())
    expect(counter.value()).toBe(1)
    a.scope.stop()
    b.scope.stop()
  })

  it('staleTime 内重新挂载同 key：零请求命中缓存', async () => {
    const { app } = createContext()
    const counter = countRequests(detailPath('ch-3'))
    const first = runInApp(app, () => useChallengeDetail('ch-3', undefined))
    await vi.waitFor(() => expect(first.value.data.value).toBeTruthy())
    first.scope.stop()

    const second = runInApp(app, () => useChallengeDetail('ch-3', undefined))
    await vi.waitFor(() => expect(second.value.data.value).toBeTruthy())
    expect(counter.value()).toBe(1)
    second.scope.stop()
  })

  it('staleTime=0 时重新挂载同 key：触发重取', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 0, gcTime: Infinity } },
    })
    const app = createApp({})
    app.use(VueQueryPlugin, { queryClient })
    const counter = countRequests(detailPath('ch-3'))
    const first = runInApp(app, () => useChallengeDetail('ch-3', undefined))
    await vi.waitFor(() => expect(first.value.data.value).toBeTruthy())
    first.scope.stop()

    const second = runInApp(app, () => useChallengeDetail('ch-3', undefined))
    await vi.waitFor(() => expect(second.value.data.value).toBeTruthy())
    expect(counter.value()).toBe(2)
    second.scope.stop()
  })

  it('role 入 key：不同 role 各自独立请求与缓存', async () => {
    const { app } = createContext()
    const roleCounter = (role: ChallengeViewerRole) =>
      countRequests(url => {
        if (url.pathname !== '/api/challenges/ch-3') return false
        return url.searchParams.get('role') === role
      })
    const visitorCounter = roleCounter('visitor')
    const publisherCounter = roleCounter('publisher')

    const visitor = runInApp(app, () => useChallengeDetail('ch-3', ref<ChallengeViewerRole>('visitor')))
    const publisher = runInApp(app, () => useChallengeDetail('ch-3', ref<ChallengeViewerRole>('publisher')))
    await vi.waitFor(() => expect(visitor.value.data.value).toBeTruthy())
    await vi.waitFor(() => expect(publisher.value.data.value).toBeTruthy())
    expect(visitor.value.data.value?.viewerRole).toBe('visitor')
    expect(publisher.value.data.value?.viewerRole).toBe('publisher')
    expect(visitorCounter.value()).toBe(1)
    expect(publisherCounter.value()).toBe(1)

    // 卸载后重挂 visitor：命中自己 role 的缓存，零请求
    visitor.scope.stop()
    const visitorAgain = runInApp(app, () => useChallengeDetail('ch-3', ref<ChallengeViewerRole>('visitor')))
    await vi.waitFor(() => expect(visitorAgain.value.data.value).toBeTruthy())
    expect(visitorCounter.value()).toBe(1)

    publisher.scope.stop()
    visitorAgain.scope.stop()
  })

  it('mutation 成功 invalidate 该难题全部缓存并自动重取', async () => {
    const id = await createTestChallenge()
    const { app } = createContext()
    const counter = countRequests(detailPath(id))

    const detail = runInApp(app, () => useChallengeDetail(id, undefined))
    await vi.waitFor(() => expect(detail.value.data.value).toBeTruthy())
    expect(detail.value.data.value?.challenge.status).toBe('scoring')
    expect(counter.value()).toBe(1)

    const claim = runInApp(app, () => useClaimChallenge())
    await claim.value.mutateAsync(id)
    await vi.waitFor(() => expect(detail.value.data.value?.challenge.status).toBe('solving'))
    expect(counter.value()).toBe(2)
    detail.scope.stop()
    claim.scope.stop()
  })

  it('list 前缀失效不影响 detail 缓存', async () => {
    const id = await createTestChallenge()
    const { app, queryClient } = createContext()
    const detailCounter = countRequests(detailPath(id))
    const listCounter = countRequests(listPath)

    const detail = runInApp(app, () => useChallengeDetail(id, undefined))
    const list = runInApp(app, () => useChallengeList(ref<ChallengeListQuery>({ page: 1, pageSize: 10 })))
    await vi.waitFor(() => expect(detail.value.data.value).toBeTruthy())
    await vi.waitFor(() => expect(list.value.data.value).toBeTruthy())
    expect(detailCounter.value()).toBe(1)

    await queryClient.invalidateQueries({ queryKey: ['challenges', 'list'] })
    await vi.waitFor(() => expect(listCounter.value()).toBe(2))
    await flushAsync()
    expect(detailCounter.value()).toBe(1)

    detail.scope.stop()
    list.scope.stop()
  })

  it('detailPrefix 失效覆盖该难题全部 role 变体', async () => {
    const id = await createTestChallenge()
    const { app, queryClient } = createContext()
    const counter = countRequests(detailPath(id))

    const visitor = runInApp(app, () => useChallengeDetail(id, ref<ChallengeViewerRole>('visitor')))
    const admin = runInApp(app, () => useChallengeDetail(id, ref<ChallengeViewerRole>('admin')))
    await vi.waitFor(() => expect(visitor.value.data.value).toBeTruthy())
    await vi.waitFor(() => expect(admin.value.data.value).toBeTruthy())
    expect(counter.value()).toBe(2)

    await queryClient.invalidateQueries({ queryKey: ['challenges', 'detail', id] })
    await vi.waitFor(() => expect(counter.value()).toBe(4))

    visitor.scope.stop()
    admin.scope.stop()
  })

  it('响应式 queryKey：filters 变化自动重取', async () => {
    const { app } = createContext()
    const pages: number[] = []
    const counter = countRequests(url => {
      if (url.pathname !== '/api/challenges') return false
      pages.push(Number(url.searchParams.get('page')))
      return true
    })

    const filters = ref<ChallengeListQuery>({ page: 1, pageSize: 10 })
    const list = runInApp(app, () => useChallengeList(filters))
    await vi.waitFor(() => expect(list.value.data.value).toBeTruthy())
    expect(pages).toContain(1)

    filters.value = { page: 2, pageSize: 10 }
    await vi.waitFor(() => expect(list.value.data.value?.page).toBe(2))
    expect(pages).toContain(2)
    expect(counter.value()).toBe(2)
    list.scope.stop()
  })
})

// cancel 变更 hook 走与 claim 相同的 invalidate 路径，此处仅做一次冒烟确保可用
describe('取消揭榜变更 hook 冒烟', () => {
  it('cancel 成功后详情自动重取为开放状态', async () => {
    const id = await createTestChallenge()
    const { app } = createContext()
    const detail = runInApp(app, () => useChallengeDetail(id, undefined))
    const claim = runInApp(app, () => useClaimChallenge())
    const cancel = runInApp(app, () => useCancelChallengeClaim())
    await vi.waitFor(() => expect(detail.value.data.value).toBeTruthy())

    await claim.value.mutateAsync(id)
    await vi.waitFor(() => expect(detail.value.data.value?.challenge.status).toBe('solving'))
    await cancel.value.mutateAsync({ id, payload: { reason: '集成测试取消' } })
    await vi.waitFor(() => expect(detail.value.data.value?.challenge.status).toBe('scoring'))

    detail.scope.stop()
    claim.scope.stop()
    cancel.scope.stop()
  })
})
