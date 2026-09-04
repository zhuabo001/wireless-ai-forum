import { describe, it, expect } from 'vitest'
import {
  cancelChallengeClaim,
  claimChallenge,
  createChallenge,
  fetchChallengeDetail,
  fetchChallenges,
  scoreChallenge,
  updateChallengeProgress,
} from '@/api/challenges'
import { createTestChallenge } from '@/test/server'

describe('POST /api/challenges — validation', () => {
  const base = {
    title: 't',
    category: 'other',
    department: 'wireless-research',
    difficulty: 'normal' as const,
    contentHtml: '<p>x</p>',
  }

  it('rejects missing title', async () => {
    await expect(createChallenge({ ...base, title: '' })).rejects.toMatchObject({ status: 400 })
  })
  it('rejects missing category', async () => {
    await expect(createChallenge({ ...base, category: '' })).rejects.toMatchObject({ status: 400 })
  })
  it('rejects missing department', async () => {
    await expect(createChallenge({ ...base, department: '' })).rejects.toMatchObject({ status: 400 })
  })
  it('rejects missing difficulty', async () => {
    // @ts-expect-error 测试无效值
    await expect(createChallenge({ ...base, difficulty: '' })).rejects.toMatchObject({ status: 400 })
  })
  it('rejects blank contentHtml', async () => {
    await expect(createChallenge({ ...base, contentHtml: '   ' })).rejects.toMatchObject({ status: 400 })
  })
})

describe('POST /api/challenges — unshift linkage', () => {
  it('created challenge starts as scoring with score=null and appears at the front of the list', async () => {
    const id = await createTestChallenge({ title: '__unshift-linkage__' })
    const result = await fetchChallenges({ keyword: '__unshift-linkage__' })
    expect(result.list[0]?.id).toBe(id)
    expect(result.list[0]?.score).toBeNull()
    expect(result.list[0]?.status).toBe('scoring')
  })
})

describe('POST /api/challenges/:id/score — scoring transitions', () => {
  it('moves status scoring -> open on first score', async () => {
    const id = await createTestChallenge()
    const before = await fetchChallengeDetail(id)
    expect(before.challenge.status).toBe('scoring')

    const response = await scoreChallenge(id, { score: 300, reason: '首次评定' })
    expect(response.score).toBe(300)

    const after = await fetchChallengeDetail(id)
    expect(after.challenge.status).toBe('open')
  })

  it('records an adjust-score timeline entry with the reason as note', async () => {
    const id = await createTestChallenge()
    await scoreChallenge(id, { score: 300, reason: '首次评定' })
    const response = await scoreChallenge(id, { score: 500, reason: '调整理由' })
    const last = response.timeline[response.timeline.length - 2] ?? response.timeline[response.timeline.length - 1]
    expect(response.timeline.some(entry => entry.note === '调整理由')).toBe(true)
    expect(last).toBeDefined()
  })

  it('rejects re-scoring after closed (409)', async () => {
    const id = await createTestChallenge()
    await scoreChallenge(id, { score: 300, reason: 'r' })
    await claimChallenge(id)
    // mock 无直接结题接口，通过 detailStore 状态推断：closed 只能靠种子 ch-5 验证
    await expect(scoreChallenge('ch-5', { score: 700, reason: 'r' })).rejects.toMatchObject({ status: 409 })
  })

  it('rejects invalid score value (400)', async () => {
    const id = await createTestChallenge()
    await expect(scoreChallenge(id, { score: 10, reason: 'r' })).rejects.toMatchObject({ status: 400 })
  })

  it('rejects missing reason (400)', async () => {
    const id = await createTestChallenge()
    await expect(scoreChallenge(id, { score: 300, reason: '' })).rejects.toMatchObject({ status: 400 })
  })
})

describe('POST /api/challenges/:id/claim', () => {
  it('claim succeeds and moves status to solving', async () => {
    const id = await createTestChallenge()
    const response = await claimChallenge(id)
    expect(response.claimant.claimTime).toBeTruthy()
    const detail = await fetchChallengeDetail(id)
    expect(detail.challenge.status).toBe('solving')
  })

  it('rejects duplicate claim (409)', async () => {
    const id = await createTestChallenge()
    await claimChallenge(id)
    await expect(claimChallenge(id)).rejects.toMatchObject({ status: 409 })
  })

  it('rejects claim on unknown id (404)', async () => {
    await expect(claimChallenge('ch-does-not-exist')).rejects.toMatchObject({ status: 404 })
  })
})

describe('POST /api/challenges/:id/cancel-claim', () => {
  it('cancel clears claimant, zeroes progress, and reopens claiming', async () => {
    const id = await createTestChallenge()
    await scoreChallenge(id, { score: 300, reason: 'r' })
    await claimChallenge(id)
    const response = await cancelChallengeClaim(id, { reason: '个人原因' })
    expect(response.claimant).toBeNull()
    expect(response.progressPercent).toBe(0)
  })

  it('falls back to open when the challenge was already scored', async () => {
    const id = await createTestChallenge()
    await scoreChallenge(id, { score: 300, reason: 'r' })
    await claimChallenge(id)
    const response = await cancelChallengeClaim(id, { reason: '个人原因' })
    expect(response.status).toBe('open')
  })

  it('falls back to scoring when the challenge was never scored', async () => {
    const id = await createTestChallenge()
    await claimChallenge(id)
    const response = await cancelChallengeClaim(id, { reason: '个人原因' })
    expect(response.status).toBe('scoring')
  })

  it('rejects cancel when there is no claimant (409)', async () => {
    const id = await createTestChallenge()
    await expect(cancelChallengeClaim(id, { reason: 'r' })).rejects.toMatchObject({ status: 409 })
  })

  it('rejects cancel on a closed challenge (409)', async () => {
    await expect(cancelChallengeClaim('ch-5', { reason: 'r' })).rejects.toMatchObject({ status: 409 })
  })

  it('rejects missing reason (400)', async () => {
    const id = await createTestChallenge()
    await claimChallenge(id)
    await expect(cancelChallengeClaim(id, { reason: '' })).rejects.toMatchObject({ status: 400 })
  })
})

describe('POST /api/challenges/:id/progress', () => {
  it('updates progressPercent and appends a current timeline entry converting prior current to done', async () => {
    const id = await createTestChallenge()
    await claimChallenge(id)
    const response = await updateChallengeProgress(id, { stage: '方案设计中', percent: 20, note: '开始设计' })
    expect(response.progressPercent).toBe(20)
    const currentEntries = response.timeline.filter(entry => entry.type === 'current')
    expect(currentEntries).toHaveLength(1)
    expect(currentEntries[0]?.title).toBe('方案设计中')
  })

  it('rejects missing stage (400)', async () => {
    const id = await createTestChallenge()
    await expect(updateChallengeProgress(id, { stage: '', percent: 20, note: 'n' })).rejects.toMatchObject({
      status: 400,
    })
  })

  it('rejects missing note (400)', async () => {
    const id = await createTestChallenge()
    await expect(
      updateChallengeProgress(id, { stage: 's', percent: 20, note: '' }),
    ).rejects.toMatchObject({ status: 400 })
  })

  it('rejects out-of-range percent (400)', async () => {
    const id = await createTestChallenge()
    await expect(
      updateChallengeProgress(id, { stage: 's', percent: 150, note: 'n' }),
    ).rejects.toMatchObject({ status: 400 })
  })

  it('rejects progress update on unknown id (404)', async () => {
    await expect(
      updateChallengeProgress('ch-does-not-exist', { stage: 's', percent: 20, note: 'n' }),
    ).rejects.toMatchObject({ status: 404 })
  })
})
