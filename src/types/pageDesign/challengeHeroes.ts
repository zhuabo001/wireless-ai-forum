/** 难题状态机：评分中 → 揭榜中 → 解题中 → 已结题 */
export type ChallengeStatus = 'scoring' | 'open' | 'solving' | 'closed'

/** 难度自评档位，发布时必填，供超管定分参考 */
export type ChallengeDifficulty = 'light' | 'normal' | 'hard' | 'critical'

/** 详情页访问者角色，驱动操作按钮显隐 */
export type ChallengeViewerRole = 'visitor' | 'publisher' | 'claimant' | 'admin'

export interface ChallengeUser {
  name: string
  initials: string
  department: string
  gradientFrom: string
  gradientTo: string
}

/** 列表页单条难题 */
export interface ChallengeItem {
  id: string
  title: string
  /** 问题类别 id，对应 ChallengeCategoryOption */
  category: string
  /** 所属部门 id，对应 ChallengeDepartmentOption */
  department: string
  /** 悬赏分值；null 表示仍在评分中 */
  score: number | null
  status: ChallengeStatus
  author: ChallengeUser
  /** 展示用相对时间，如「2小时前」 */
  publishTime: string
  /** 发布日期（YYYY-MM-DD），用于日期筛选 */
  publishDate: string
  claimCount: number
  viewCount: number
  likeCount: number
  /** 已被揭榜时的揭榜人姓名 */
  claimedBy?: string
}

export interface ChallengeCategoryOption {
  id: string
  name: string
}

export interface ChallengeDepartmentOption {
  id: string
  name: string
}

export interface ChallengeDifficultyOption {
  id: ChallengeDifficulty
  name: string
  description: string
}

export interface ChallengeSortOption {
  id: string
  name: string
}

export interface ChallengeTab {
  id: string
  name: string
}

/** 题目类榜单条目（浏览榜、有用榜） */
export interface ChallengeRankEntry {
  id: string
  title: string
  value: string
}

/** 人物类榜单条目（近期分数榜） */
export interface ChallengeScoreRankEntry {
  user: ChallengeUser
  scoreGain: string
}

export interface ChallengeSidebarData {
  viewRank: ChallengeRankEntry[]
  usefulRank: ChallengeRankEntry[]
  scoreRank: ChallengeScoreRankEntry[]
}

/** 揭榜进度时间线条目 */
export interface ChallengeTimelineEntry {
  id: string
  type: 'done' | 'current' | 'pending'
  title: string
  time: string
  note?: string
}

/** 已揭榜信息 */
export interface ChallengeClaimant {
  user: ChallengeUser
  claimTime: string
  stats: string
}

export interface ChallengeDetail {
  id: string
  title: string
  category: string
  department: string
  score: number | null
  status: ChallengeStatus
  difficulty: ChallengeDifficulty
  author: ChallengeUser
  publishDate: string
  viewCount: number
  commentCount: number
  likeCount: number
  claimant?: ChallengeClaimant
  progressPercent: number
  timeline: ChallengeTimelineEntry[]
}

export interface ChallengePageMeta {
  title: string
  description: string
  createButtonText: string
}

/** 发布难题表单提交内容 */
export interface ChallengeFormData {
  title: string
  category: string
  department: string
  difficulty: ChallengeDifficulty | ''
  contentHtml: string
}
