import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import type { ChallengeListQuery } from './challenges'
import type { ChallengeViewerRole } from '@/types/pageDesign/challengeHeroes'

/**
 * queryKey 工厂。role 必须进 detail key——mock 详情接口按 role 返回不同 viewerRole，
 * 缓存若不区分 role，切换角色演示时会读到别的角色的缓存结果。
 */
export const challengeKeys = {
  all: ['challenges'] as const,

  meta: () => [...challengeKeys.all, 'meta'] as const,

  lists: () => [...challengeKeys.all, 'list'] as const,
  list: (filters: MaybeRefOrGetter<ChallengeListQuery>) =>
    [...challengeKeys.lists(), toValue(filters)] as const,

  details: () => [...challengeKeys.all, 'detail'] as const,
  /** 某难题下全部 role 变体的公共前缀，用于 mutation 后一次性失效该难题的所有缓存 */
  detailPrefix: (id: MaybeRefOrGetter<string>) => [...challengeKeys.details(), toValue(id)] as const,
  detail: (id: MaybeRefOrGetter<string>, role: MaybeRefOrGetter<ChallengeViewerRole | undefined>) =>
    [...challengeKeys.detailPrefix(id), toValue(role)] as const,

  comments: (id: MaybeRefOrGetter<string>, sort: MaybeRefOrGetter<string>) =>
    [...challengeKeys.all, 'comments', toValue(id), toValue(sort)] as const,
}
