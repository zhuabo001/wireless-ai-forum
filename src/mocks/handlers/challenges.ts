import { http, HttpResponse } from 'msw'
import {
  challengePageMeta,
  challengeTabs,
  challengeCategoryOptions,
  challengeDepartmentOptions,
  challengeDifficultyOptions,
  challengeSortOptions,
  challengeSidebarData,
  challengeItems,
  challengeDetail,
  challengeContentHtml,
  challengeComments,
  challengeCommentSortOptions,
  challengeCurrentUser,
} from '@/data/pageDesign/challengeHeroes'
import type {
  ChallengeDetail,
  ChallengeItem,
  ChallengeTimelineEntry,
  ChallengeViewerRole,
} from '@/types/pageDesign/challengeHeroes'
import { createListHandler, paginate, parseListQuery } from './utils'

/** 列表数据在 mock 生命周期内可变（发布、揭榜、评分会写入） */
const items: ChallengeItem[] = [...challengeItems]

/** 详情数据缓存：ch-3 使用完整种子，其余 id 按需从列表项合成 */
interface StoredDetail {
  challenge: ChallengeDetail
  contentHtml: string
}
const detailStore = new Map<string, StoredDetail>()

const VALID_ROLES: ChallengeViewerRole[] = ['visitor', 'publisher', 'claimant', 'admin']

function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

/** 从列表项合成一个合理的详情（用于非种子详情的 id） */
function synthesizeDetail(item: ChallengeItem): StoredDetail {
  const timeline: ChallengeTimelineEntry[] = [
    { id: nextId('tl'), type: 'done', title: `${item.author.name} 发布难题`, time: item.publishTime },
  ]
  if (item.score !== null) {
    timeline.push({
      id: nextId('tl'),
      type: 'done',
      title: `平台管理员 评定分值 ${item.score} 分`,
      time: item.publishTime,
    })
  }
  if (item.claimedBy) {
    timeline.push({ id: nextId('tl'), type: 'done', title: `${item.claimedBy} 揭榜`, time: item.publishTime })
    timeline.push({
      id: nextId('tl'),
      type: item.status === 'closed' ? 'done' : 'current',
      title: item.status === 'closed' ? '验收结题 · 悬赏积分划转' : '方案推进中',
      time: item.status === 'closed' ? item.publishTime : '进行中',
    })
  }
  if (item.status !== 'closed') {
    timeline.push({ id: nextId('tl'), type: 'pending', title: '验收结题 · 悬赏积分划转', time: '待完成' })
  }

  const progressPercent =
    item.status === 'closed' ? 100 : item.status === 'solving' ? 60 : item.status === 'open' ? 15 : 5

  return {
    challenge: {
      id: item.id,
      title: item.title,
      category: item.category,
      department: item.department,
      score: item.score,
      status: item.status,
      difficulty: 'normal',
      author: item.author,
      publishDate: item.publishDate,
      viewCount: item.viewCount,
      commentCount: item.claimCount * 2,
      likeCount: item.likeCount,
      claimant: item.claimedBy
        ? {
            user: { ...item.author, name: item.claimedBy, initials: item.claimedBy.charAt(0) },
            claimTime: '近期揭榜',
            stats: '揭榜 1 题',
          }
        : undefined,
      progressPercent,
      timeline,
    },
    contentHtml: `<h2>一、背景与场景</h2><p>${item.title}（示例正文：该难题的完整背景、现状痛点、期望目标与已有材料将在真实数据中填充。）</p><h2>二、期望目标</h2><p>欢迎在评论区交流思路，或直接揭榜提交解决方案。</p>`,
  }
}

function getOrCreateDetail(id: string): StoredDetail | null {
  const stored = detailStore.get(id)
  if (stored) return stored
  if (id === challengeDetail.id) {
    const seeded = { challenge: challengeDetail, contentHtml: challengeContentHtml }
    detailStore.set(id, seeded)
    return seeded
  }
  const item = items.find(i => i.id === id)
  if (!item) return null
  const synthesized = synthesizeDetail(item)
  detailStore.set(id, synthesized)
  return synthesized
}

/** 列表项与详情联动更新（分值、状态、揭榜人变化时调用） */
function syncListItem(detail: ChallengeDetail): void {
  const item = items.find(i => i.id === detail.id)
  if (!item) return
  item.score = detail.score
  item.status = detail.status
  item.claimedBy = detail.claimant?.user.name
  item.likeCount = detail.likeCount
  item.viewCount = detail.viewCount
}

/** 追加一条时间线记录：插入到首个 pending 条目之前，保持「已完成 → 进行中 → 待完成」的叙事顺序 */
function appendTimelineEntry(timeline: ChallengeTimelineEntry[], entry: ChallengeTimelineEntry): void {
  const pendingIndex = timeline.findIndex(item => item.type === 'pending')
  if (pendingIndex === -1) {
    timeline.push(entry)
    return
  }
  timeline.splice(pendingIndex, 0, entry)
}

function badRequest(message: string) {
  return HttpResponse.json({ message }, { status: 400 })
}

export const challengeHandlers = [
  createListHandler('/api/challenges', items, {
    filterByQuery: (list, url) => {
      const tab = url.searchParams.get('tab')
      const department = url.searchParams.get('department')
      const date = url.searchParams.get('date')

      let result = list
      if (tab === 'my-published') {
        result = result.filter(item => item.author.name === challengeCurrentUser.name)
      } else if (tab === 'my-claimed') {
        result = result.filter(item => item.claimedBy === challengeCurrentUser.name)
      }
      if (department) {
        result = result.filter(item => item.department === department)
      }
      if (date) {
        result = result.filter(item => item.publishDate === date)
      }
      return result
    },
    keywordFields: item => [item.title, item.author.name],
    sorters: {
      // 评分中（score 为 null）的难题在按悬赏排序时沉底
      'highest-score': (a, b) => (b.score ?? -1) - (a.score ?? -1),
      'most-claimed': (a, b) => b.claimCount - a.claimCount,
    },
  }),

  http.get('/api/challenges/meta', () => {
    return HttpResponse.json({
      meta: challengePageMeta,
      tabs: challengeTabs,
      categoryOptions: challengeCategoryOptions,
      departmentOptions: challengeDepartmentOptions,
      difficultyOptions: challengeDifficultyOptions,
      sortOptions: challengeSortOptions,
      sidebar: challengeSidebarData,
    })
  }),

  http.get('/api/challenges/:id', ({ params, request }) => {
    const stored = getOrCreateDetail(String(params.id))
    if (!stored) {
      return HttpResponse.json({ message: 'Challenge not found' }, { status: 404 })
    }
    const url = new URL(request.url)
    const roleParam = url.searchParams.get('role') as ChallengeViewerRole | null
    const viewerRole: ChallengeViewerRole =
      roleParam && VALID_ROLES.includes(roleParam) ? roleParam : 'visitor'
    return HttpResponse.json({
      challenge: stored.challenge,
      contentHtml: stored.contentHtml,
      viewerRole,
      currentUser: challengeCurrentUser,
    })
  }),

  http.get('/api/challenges/:id/comments', ({ request }) => {
    const url = new URL(request.url)
    const sort = url.searchParams.get('sort')
    const list =
      sort === 'hottest'
        ? [...challengeComments].sort((a, b) => b.likes - a.likes)
        : challengeComments
    return HttpResponse.json({
      ...paginate(list, parseListQuery(url)),
      sortOptions: challengeCommentSortOptions,
    })
  }),

  http.post('/api/challenges', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const category = typeof body.category === 'string' ? body.category : ''
    const department = typeof body.department === 'string' ? body.department : ''
    const difficulty = typeof body.difficulty === 'string' ? body.difficulty : ''
    const contentHtml = typeof body.contentHtml === 'string' ? body.contentHtml : ''

    if (!title) return badRequest('请填写难题题目')
    if (!category) return badRequest('请选择问题类别')
    if (!department) return badRequest('请选择所属部门')
    if (!difficulty) return badRequest('请选择难度自评')
    if (!contentHtml.trim()) return badRequest('请填写难题内容')

    const id = nextId('ch')
    const newItem: ChallengeItem = {
      id,
      title,
      category,
      department,
      score: null,
      status: 'scoring',
      author: {
        name: challengeCurrentUser.name,
        initials: challengeCurrentUser.initials ?? challengeCurrentUser.name.charAt(0),
        department: challengeCurrentUser.department,
        gradientFrom: 'from-slate-400',
        gradientTo: 'to-slate-500',
      },
      publishTime: '刚刚',
      publishDate: '2026-09-03',
      claimCount: 0,
      viewCount: 0,
      likeCount: 0,
    }
    items.unshift(newItem)
    const seeded = synthesizeDetail(newItem)
    seeded.challenge.difficulty = difficulty as ChallengeDetail['difficulty']
    seeded.contentHtml = contentHtml
    detailStore.set(id, seeded)
    return HttpResponse.json({ id }, { status: 201 })
  }),

  http.post('/api/challenges/:id/claim', ({ params }) => {
    const stored = getOrCreateDetail(String(params.id))
    if (!stored) {
      return HttpResponse.json({ message: 'Challenge not found' }, { status: 404 })
    }
    if (stored.challenge.claimant) {
      return HttpResponse.json({ message: '该难题已被揭榜' }, { status: 409 })
    }
    const claimant = {
      user: {
        name: challengeCurrentUser.name,
        initials: challengeCurrentUser.initials ?? challengeCurrentUser.name.charAt(0),
        department: challengeCurrentUser.department,
        gradientFrom: 'from-slate-400',
        gradientTo: 'to-slate-500',
      },
      claimTime: '刚刚揭榜',
      stats: '揭榜 1 题',
    }
    stored.challenge.claimant = claimant
    stored.challenge.status = 'solving'
    appendTimelineEntry(stored.challenge.timeline, {
      id: nextId('tl'),
      type: 'done',
      title: `${challengeCurrentUser.name} 揭榜`,
      time: '刚刚',
    })
    const listItem = items.find(i => i.id === stored.challenge.id)
    if (listItem) listItem.claimCount += 1
    syncListItem(stored.challenge)
    return HttpResponse.json({ claimant, timeline: stored.challenge.timeline })
  }),

  http.post('/api/challenges/:id/score', async ({ params, request }) => {
    const stored = getOrCreateDetail(String(params.id))
    if (!stored) {
      return HttpResponse.json({ message: 'Challenge not found' }, { status: 404 })
    }
    if (stored.challenge.status === 'closed') {
      return HttpResponse.json({ message: '结题后分值不可再调整' }, { status: 409 })
    }
    const body = (await request.json()) as Record<string, unknown>
    const score = Number(body.score)
    const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
    if (!Number.isInteger(score) || score < 50 || score > 2000) {
      return badRequest('请填写有效分值（50–2000）')
    }
    if (!reason) return badRequest('请填写评定理由')

    const previous = stored.challenge.score
    stored.challenge.score = score
    if (stored.challenge.status === 'scoring') {
      stored.challenge.status = 'open'
    }
    appendTimelineEntry(stored.challenge.timeline, {
      id: nextId('tl'),
      type: 'done',
      title:
        previous === null
          ? `平台管理员 评定分值 ${score} 分`
          : `平台管理员 调整分值 ${previous} → ${score} 分`,
      time: '刚刚',
      note: reason,
    })
    syncListItem(stored.challenge)
    return HttpResponse.json({ score, timeline: stored.challenge.timeline })
  }),

  http.post('/api/challenges/:id/progress', async ({ params, request }) => {
    const stored = getOrCreateDetail(String(params.id))
    if (!stored) {
      return HttpResponse.json({ message: 'Challenge not found' }, { status: 404 })
    }
    const body = (await request.json()) as Record<string, unknown>
    const stage = typeof body.stage === 'string' ? body.stage.trim() : ''
    const percent = Number(body.percent)
    const note = typeof body.note === 'string' ? body.note.trim() : ''
    if (!stage) return badRequest('请选择当前阶段')
    if (!note) return badRequest('请填写进度说明')
    if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
      return badRequest('进度百分比需在 0–100 之间')
    }

    for (const entry of stored.challenge.timeline) {
      if (entry.type === 'current') entry.type = 'done'
    }
    appendTimelineEntry(stored.challenge.timeline, {
      id: nextId('tl'),
      type: 'current',
      title: stage,
      time: '进行中',
      note,
    })
    stored.challenge.progressPercent = percent
    return HttpResponse.json({
      progressPercent: stored.challenge.progressPercent,
      timeline: stored.challenge.timeline,
    })
  }),
]
