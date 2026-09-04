import { describe, it, expect } from 'vitest'
import { fetchChallengeMeta, fetchChallenges, fetchChallengeDetail, fetchChallengeComments } from '@/api/challenges'
import { ApiError } from '@/api/http'

describe('GET /api/challenges/meta', () => {
  it('returns all seven meta fields', async () => {
    const meta = await fetchChallengeMeta()
    expect(Object.keys(meta).sort()).toEqual(
      ['categoryOptions', 'departmentOptions', 'difficultyOptions', 'meta', 'sidebar', 'sortOptions', 'tabs'].sort(),
    )
  })

  it('sidebar carries both scoreRank and totalScoreRank', async () => {
    const meta = await fetchChallengeMeta()
    expect(meta.sidebar.scoreRank.length).toBeGreaterThan(0)
    expect(meta.sidebar.totalScoreRank.length).toBeGreaterThan(0)
  })
})

describe('GET /api/challenges — pagination shape', () => {
  it('returns PagedResult with default page/pageSize', async () => {
    const result = await fetchChallenges()
    expect(result).toMatchObject({ page: 1, pageSize: 10 })
    expect(Array.isArray(result.list)).toBe(true)
    expect(result.total).toBeGreaterThanOrEqual(result.list.length)
  })

  it('honors explicit page/pageSize', async () => {
    const result = await fetchChallenges({ page: 2, pageSize: 3 })
    expect(result.page).toBe(2)
    expect(result.pageSize).toBe(3)
    expect(result.list.length).toBeLessThanOrEqual(3)
  })
})

describe('GET /api/challenges — tab filter', () => {
  it('my-published only returns current user authored items (seed has none)', async () => {
    const result = await fetchChallenges({ tab: 'my-published' })
    expect(result.list).toHaveLength(0)
  })

  it('my-claimed only returns items claimed by current user (seed has none)', async () => {
    const result = await fetchChallenges({ tab: 'my-claimed' })
    expect(result.list).toHaveLength(0)
  })

  it('all returns the full seed list on page 1', async () => {
    const result = await fetchChallenges({ tab: 'all', pageSize: 100 })
    expect(result.total).toBe(12)
  })
})

describe('GET /api/challenges — department/date/keyword filter', () => {
  it('filters by department', async () => {
    const result = await fetchChallenges({ department: 'core-network', pageSize: 100 })
    expect(result.list.every(item => item.department === 'core-network')).toBe(true)
    expect(result.list.length).toBeGreaterThan(0)
  })

  it('filters by exact publishDate', async () => {
    const result = await fetchChallenges({ date: '2026-09-03', pageSize: 100 })
    expect(result.list.every(item => item.publishDate === '2026-09-03')).toBe(true)
    expect(result.list.length).toBeGreaterThan(0)
  })

  it('matches keyword against title case-insensitively', async () => {
    const result = await fetchChallenges({ keyword: 'MIMO', pageSize: 100 })
    expect(result.list.length).toBeGreaterThan(0)
    expect(result.list.every(item => item.title.toLowerCase().includes('mimo'))).toBe(true)
  })

  it('matches keyword against author name', async () => {
    const result = await fetchChallenges({ keyword: '陈志强', pageSize: 100 })
    expect(result.list.length).toBeGreaterThan(0)
    expect(result.list.every(item => item.author.name === '陈志强')).toBe(true)
  })
})

describe('GET /api/challenges — sort', () => {
  it('highest-score sorts descending with score=null (scoring) items at the bottom', async () => {
    const result = await fetchChallenges({ sort: 'highest-score', pageSize: 100 })
    const scores = result.list.map(item => item.score)
    const nonNull = scores.filter((s): s is number => s !== null)
    expect(nonNull).toEqual([...nonNull].sort((a, b) => b - a))
    const lastTwo = scores.slice(-2)
    expect(lastTwo.every(s => s === null)).toBe(true)
  })

  it('most-claimed sorts descending by claimCount', async () => {
    const result = await fetchChallenges({ sort: 'most-claimed', pageSize: 100 })
    const counts = result.list.map(item => item.claimCount)
    expect(counts).toEqual([...counts].sort((a, b) => b - a))
  })
})

describe('GET /api/challenges/:id', () => {
  it('defaults viewerRole to visitor when role is omitted', async () => {
    const response = await fetchChallengeDetail('ch-3')
    expect(response.viewerRole).toBe('visitor')
    expect(response.challenge.id).toBe('ch-3')
  })

  it('echoes back a valid explicit role', async () => {
    const response = await fetchChallengeDetail('ch-3', 'publisher')
    expect(response.viewerRole).toBe('publisher')
  })

  it('synthesizes a detail for non-seeded ids', async () => {
    const response = await fetchChallengeDetail('ch-7')
    expect(response.challenge.id).toBe('ch-7')
    // 合成详情应带出列表项标题作为正文与时间线起点
    expect(response.contentHtml).toContain('Massive MIMO 权值寻优')
    expect(response.challenge.timeline.some(entry => entry.title.includes('发布难题'))).toBe(true)
  })

  it('throws a 404 ApiError for unknown id', async () => {
    await expect(fetchChallengeDetail('ch-does-not-exist')).rejects.toMatchObject({
      status: 404,
    } satisfies Partial<ApiError>)
  })
})

describe('GET /api/challenges/:id/comments', () => {
  it('defaults to the seed (latest) order', async () => {
    const response = await fetchChallengeComments('ch-3')
    expect(response.list.map(c => c.id)).toEqual(['cc-1', 'cc-2', 'cc-3'])
  })

  it('sorts by likes desc when sort=hottest', async () => {
    const response = await fetchChallengeComments('ch-3', { sort: 'hottest' })
    const likes = response.list.map(c => c.likes)
    expect(likes).toEqual([...likes].sort((a, b) => b - a))
  })

  it('returns available sortOptions', async () => {
    const response = await fetchChallengeComments('ch-3')
    expect(response.sortOptions.map(o => o.id).sort()).toEqual(['hottest', 'latest'])
  })
})
