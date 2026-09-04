import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
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
    queryKey: challengeKeys.list(filters),
    queryFn: () => fetchChallenges(toValue(filters)),
  })
}

export function useChallengeDetail(
  id: MaybeRefOrGetter<string>,
  role: MaybeRefOrGetter<ChallengeViewerRole | undefined>,
) {
  return useQuery({
    queryKey: challengeKeys.detail(id, role),
    queryFn: () => fetchChallengeDetail(toValue(id), toValue(role)),
  })
}

export function useChallengeComments(id: MaybeRefOrGetter<string>, sort: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: challengeKeys.comments(id, sort),
    queryFn: () => fetchChallengeComments(toValue(id), { sort: toValue(sort) }),
  })
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
      void queryClient.invalidateQueries({ queryKey: challengeKeys.detailPrefix(id) })
      void queryClient.invalidateQueries({ queryKey: challengeKeys.lists() })
    },
  })
}

export function useCancelChallengeClaim() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CancelClaimPayload }) =>
      cancelChallengeClaim(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: challengeKeys.detailPrefix(id) })
      void queryClient.invalidateQueries({ queryKey: challengeKeys.lists() })
    },
  })
}

export function useScoreChallenge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ScoreChallengePayload }) =>
      scoreChallenge(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: challengeKeys.detailPrefix(id) })
      void queryClient.invalidateQueries({ queryKey: challengeKeys.lists() })
    },
  })
}

export function useUpdateChallengeProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProgressPayload }) =>
      updateChallengeProgress(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: challengeKeys.detailPrefix(id) })
      void queryClient.invalidateQueries({ queryKey: challengeKeys.lists() })
    },
  })
}
