import { setupServer } from 'msw/node'
import { handlers } from '@/mocks/handlers'
import { createChallenge, type CreateChallengePayload } from '@/api/challenges'

export const server = setupServer(...handlers)

/**
 * 创建一个专属测试难题并返回其 id。
 * mock handlers 的 items/detailStore 是模块级可变状态，文件内所有测试共享——
 * 涉及写操作的用例必须用此函数造专属 id，禁止复用固定种子 id 做写操作。
 */
export async function createTestChallenge(
  overrides: Partial<CreateChallengePayload> = {},
): Promise<string> {
  const { id } = await createChallenge({
    title: overrides.title ?? `契约测试难题-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    category: overrides.category ?? 'other',
    department: overrides.department ?? 'wireless-research',
    difficulty: overrides.difficulty ?? 'normal',
    contentHtml: overrides.contentHtml ?? '<p>契约测试内容</p>',
  })
  return id
}

/** 统计满足 predicate 的请求次数，用于断言「缓存命中 = 零请求」（M5 集成测试使用） */
export function countRequests(predicate: (url: URL) => boolean): { value: () => number } {
  let count = 0
  server.events.on('request:start', ({ request }) => {
    if (predicate(new URL(request.url))) count += 1
  })
  return { value: () => count }
}
