import type { ChallengeStatus } from '@/types/pageDesign/challengeHeroes'

interface StatusMeta {
  label: string
  badgeClass: string
}

/** 难题状态到徽章文案与配色的映射（列表页、详情页共用） */
export const challengeStatusMeta: Record<ChallengeStatus, StatusMeta> = {
  // scoring 的「评分中」由分值槽位单独展示，状态槽统一对外呈现「揭榜中」
  scoring: { label: '揭榜中', badgeClass: 'bg-emerald-50 text-emerald-600' },
  open: { label: '揭榜中', badgeClass: 'bg-emerald-50 text-emerald-600' },
  solving: { label: '解题中', badgeClass: 'bg-blue-50 text-blue-600' },
  closed: { label: '已揭榜', badgeClass: 'bg-blue-50 text-blue-600' },
}

/** 按 id 在选项集中查找展示名，未命中时回退为原 id */
export function resolveOptionName(options: { id: string; name: string }[], id: string): string {
  return options.find(option => option.id === id)?.name ?? id
}
