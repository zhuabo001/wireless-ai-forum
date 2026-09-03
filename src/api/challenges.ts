import { get, post, type PagedResult } from './http'
import type { PageQuery } from '@/types/api'
import type {
  ChallengeCategoryOption,
  ChallengeClaimant,
  ChallengeDepartmentOption,
  ChallengeDetail,
  ChallengeDifficulty,
  ChallengeDifficultyOption,
  ChallengeItem,
  ChallengePageMeta,
  ChallengeSidebarData,
  ChallengeSortOption,
  ChallengeTab,
  ChallengeTimelineEntry,
  ChallengeViewerRole,
} from '@/types/pageDesign/challengeHeroes'
import type { Comment, CommentSortOption, PostAuthor } from '@/types/pageDesign/forumPostDetail'

/** 难题列表查询参数 */
export interface ChallengeListQuery extends PageQuery {
  /** tab：all 全部 / my-published 我的发布 / my-claimed 我的揭榜 */
  tab?: string
  /** 所属部门 id；缺省表示全部部门 */
  department?: string
  /** 排序：latest 最新发布 / highest-score 悬赏最高 / most-claimed 最多揭榜 */
  sort?: string
  /** 发布日期（YYYY-MM-DD），按日精确过滤 */
  date?: string
  /** 关键词，模糊匹配标题与发布人 */
  keyword?: string
}

export interface ChallengeMetaResponse {
  meta: ChallengePageMeta
  tabs: ChallengeTab[]
  categoryOptions: ChallengeCategoryOption[]
  departmentOptions: ChallengeDepartmentOption[]
  difficultyOptions: ChallengeDifficultyOption[]
  sortOptions: ChallengeSortOption[]
  sidebar: ChallengeSidebarData
}

export interface ChallengeDetailResponse {
  challenge: ChallengeDetail
  contentHtml: string
  /** 当前访问者在该难题下的角色，驱动操作按钮显隐 */
  viewerRole: ChallengeViewerRole
  currentUser: PostAuthor
}

export interface ChallengeCommentListResponse extends PagedResult<Comment> {
  sortOptions: CommentSortOption[]
}

/** 发布难题请求体；分值不在其中——由超管评定，发布者不可自定义 */
export interface CreateChallengePayload {
  title: string
  /** 问题类别 id */
  category: string
  /** 所属部门 id */
  department: string
  /** 难度自评，供超管定分参考 */
  difficulty: ChallengeDifficulty
  /** 富文本正文 HTML */
  contentHtml: string
}

export interface CreateChallengeResponse {
  id: string
}

/** 超管定分/调分请求体 */
export interface ScoreChallengePayload {
  /** 评定分值，最低 50 */
  score: number
  /** 评定理由，必填，将写入揭榜进度留痕 */
  reason: string
}

export interface ScoreChallengeResponse {
  score: number
  timeline: ChallengeTimelineEntry[]
}

/** 揭榜人更新进度请求体 */
export interface UpdateProgressPayload {
  /** 阶段名，如「试点验证中」 */
  stage: string
  /** 解决进度百分比（0–100） */
  percent: number
  /** 进度说明，必填 */
  note: string
}

export interface UpdateProgressResponse {
  progressPercent: number
  timeline: ChallengeTimelineEntry[]
}

export interface ClaimChallengeResponse {
  claimant: ChallengeClaimant
  timeline: ChallengeTimelineEntry[]
}

/**
 * 分页查询难题列表。
 *
 * @param query - 过滤与分页参数，见 {@link ChallengeListQuery}
 * @returns 分页后的难题条目；评分中的难题 `score` 为 null
 */
export function fetchChallenges(query?: ChallengeListQuery): Promise<PagedResult<ChallengeItem>> {
  return get('/api/challenges', query)
}

/**
 * 获取难题英雄榜页面元数据：文案、tab、各部门/类别/难度/排序选项与右侧三榜单。
 *
 * @returns 页面元数据集合
 */
export function fetchChallengeMeta(): Promise<ChallengeMetaResponse> {
  return get('/api/challenges/meta')
}

/**
 * 获取单个难题的详情、正文 HTML 与访问者角色。
 *
 * @param id - 难题 id
 * @param role - 指定查看角色；仅 mock 阶段用于演示权限差异，正式环境由登录态决定，应省略
 * @returns 详情、正文与角色信息；难题不存在时抛出 404 ApiError
 */
export function fetchChallengeDetail(
  id: string,
  role?: ChallengeViewerRole,
): Promise<ChallengeDetailResponse> {
  return get(`/api/challenges/${id}`, role ? { role } : undefined)
}

/**
 * 分页获取难题评论。
 *
 * @param id - 难题 id
 * @param query - 排序（hottest 最热 / latest 最新）与分页参数
 * @returns 分页评论列表与可用排序项
 */
export function fetchChallengeComments(
  id: string,
  query?: { sort?: string } & PageQuery,
): Promise<ChallengeCommentListResponse> {
  return get(`/api/challenges/${id}/comments`, query)
}

/**
 * 发布新难题。发布后进入「评分中」状态，由超管评定悬赏分值。
 *
 * @param payload - 难题表单内容，见 {@link CreateChallengePayload}
 * @returns 新难题 id，可用于跳转详情页
 */
export function createChallenge(payload: CreateChallengePayload): Promise<CreateChallengeResponse> {
  return post('/api/challenges', payload)
}

/**
 * 揭榜：当前用户认领该难题，难题进入「解题中」状态。
 *
 * @param id - 难题 id
 * @returns 揭榜人信息与更新后的进度时间线；已被揭榜时抛出 409 ApiError
 */
export function claimChallenge(id: string): Promise<ClaimChallengeResponse> {
  return post(`/api/challenges/${id}/claim`)
}

/**
 * 超管评定或调整悬赏分值，理由必填并写入揭榜进度。
 *
 * @param id - 难题 id
 * @param payload - 分值与评定理由，见 {@link ScoreChallengePayload}
 * @returns 评定后的分值与更新后的进度时间线
 */
export function scoreChallenge(
  id: string,
  payload: ScoreChallengePayload,
): Promise<ScoreChallengeResponse> {
  return post(`/api/challenges/${id}/score`, payload)
}

/**
 * 揭榜人更新解题进度，与详情页进度组件联动。
 *
 * @param id - 难题 id
 * @param payload - 阶段、百分比与说明，见 {@link UpdateProgressPayload}
 * @returns 更新后的进度百分比与时间线
 */
export function updateChallengeProgress(
  id: string,
  payload: UpdateProgressPayload,
): Promise<UpdateProgressResponse> {
  return post(`/api/challenges/${id}/progress`, payload)
}
