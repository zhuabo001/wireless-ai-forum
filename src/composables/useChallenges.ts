import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import { keepPreviousData, useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/vue-query'
import { challengeKeys } from '@/api/challengeKeys'
import {
  cancelChallengeClaim,
  claimChallenge,
  createChallenge,
  fetchChallengeComments,
  fetchChallengeDetail,
  fetchChallengeMeta,
  fetchChallenges,
  scoreChallenge,
  updateChallengeProgress,
  type CancelClaimPayload,
  type ChallengeListQuery,
  type CreateChallengePayload,
  type ScoreChallengePayload,
  type UpdateProgressPayload,
} from '@/api/challenges'
import type { ChallengeViewerRole } from '@/types/pageDesign/challengeHeroes'

/** 页面元数据几乎不随会话变化，缓存永不过期（无对应 mutation 会使其失效） */
export function useChallengeMeta() {
  return useQuery({
    queryKey: challengeKeys.meta(),
    queryFn: fetchChallengeMeta,
    staleTime: Infinity,
  })
}

export function useChallengeList(filters: MaybeRefOrGetter<ChallengeListQuery>) {
  return useQuery({
    // queryKey 必须是 Ref/computed 才会被 vue-query 追踪；challengeKeys.list() 内部
    // toValue(filters) 是一次性求值，若直接传入结果数组会冻结成发起时的快照
    queryKey: computed(() => challengeKeys.list(filters)),
    queryFn: () => fetchChallenges(toValue(filters)),
  })
}

export function useChallengeDetail(
  id: MaybeRefOrGetter<string>,
  role: MaybeRefOrGetter<ChallengeViewerRole | undefined>,
) {
  return useQuery({
    queryKey: computed(() => challengeKeys.detail(id, role)),
    queryFn: () => fetchChallengeDetail(toValue(id), toValue(role)),
    // 角色切换/揭榜导致 key 变化时保留旧数据直到新数据到达，避免整页折叠成「加载中」
    placeholderData: keepPreviousData,
  })
}

export function useChallengeComments(
  id: MaybeRefOrGetter<string>,
  sort: MaybeRefOrGetter<string>,
  options: { enabled?: MaybeRefOrGetter<boolean> } = {},
) {
  return useQuery({
    queryKey: computed(() => challengeKeys.comments(id, sort)),
    queryFn: () => fetchChallengeComments(toValue(id), { sort: toValue(sort) }),
    enabled: options.enabled,
  })
}

/** 变更成功后统一失效：该难题全部 role 变体 + 列表（claim/cancel/score/progress 共用） */
function invalidateChallengeAfterMutation(queryClient: QueryClient, id: string): void {
  void queryClient.invalidateQueries({ queryKey: challengeKeys.detailPrefix(id) })
  void queryClient.invalidateQueries({ queryKey: challengeKeys.lists() })
}

export function useCreateChallenge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateChallengePayload) => createChallenge(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: challengeKeys.lists() })
    },
  })
}

export function useClaimChallenge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => claimChallenge(id),
    onSuccess: (_data, id) => {
      invalidateChallengeAfterMutation(queryClient, id)
    },
  })
}

export function useCancelChallengeClaim() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CancelClaimPayload }) =>
      cancelChallengeClaim(id, payload),
    onSuccess: (_data, { id }) => {
      invalidateChallengeAfterMutation(queryClient, id)
    },
  })
}

export function useScoreChallenge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ScoreChallengePayload }) =>
      scoreChallenge(id, payload),
    onSuccess: (_data, { id }) => {
      invalidateChallengeAfterMutation(queryClient, id)
    },
  })
}

export function useUpdateChallengeProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProgressPayload }) =>
      updateChallengeProgress(id, payload),
    onSuccess: (_data, { id }) => {
      invalidateChallengeAfterMutation(queryClient, id)
    },
  })
}
