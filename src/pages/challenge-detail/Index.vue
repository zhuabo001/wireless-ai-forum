<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  useCancelChallengeClaim,
  useChallengeComments,
  useChallengeDetail,
  useClaimChallenge,
  useScoreChallenge,
  useUpdateChallengeProgress,
} from '@/composables/useChallenges'
import { ApiError } from '@/api/http'
import type { ChallengeViewerRole } from '@/types/pageDesign/challengeHeroes'
import type { Comment, Reply } from '@/types/pageDesign/forumPostDetail'
import { challengeDifficultyOptions } from '@/data/pageDesign/challengeHeroes'
import PostContent from '@/components/PostContent.vue'
import CommentSection from '@/components/comments/CommentSection.vue'
import ChallengeHeader from './ChallengeHeader.vue'
import ProgressPanel from './ProgressPanel.vue'
import ScoreDialog from './ScoreDialog.vue'
import ProgressDialog from './ProgressDialog.vue'
import CancelClaimDialog from './CancelClaimDialog.vue'
import ChallengeFloatingActions from './ChallengeFloatingActions.vue'
import RoleSwitcher from './RoleSwitcher.vue'

const route = useRoute()
const challengeId = String(route.params.id)

// mock 阶段角色由本地 ref 手动切换（RoleSwitcher 演示用）；role 入 queryKey，
// 切换后自动重取对应角色视角的详情
const roleOverride = ref<ChallengeViewerRole | undefined>(undefined)

const { data: detailData, isPending, isError, refetch } = useChallengeDetail(challengeId, roleOverride)
const challenge = computed(() => detailData.value?.challenge ?? null)
const contentHtml = computed(() => detailData.value?.contentHtml ?? '')
const viewerRole = computed<ChallengeViewerRole>(() => detailData.value?.viewerRole ?? 'visitor')
const currentUser = computed(() => detailData.value?.currentUser ?? null)

const currentSort = ref<string>('latest')
const { data: commentsData } = useChallengeComments(challengeId, currentSort)
const comments = computed(() => commentsData.value?.list ?? [])
const commentSortOptions = computed(() => commentsData.value?.sortOptions ?? [])

const isLiked = ref<boolean>(false)
const likeCount = computed<number>(() => (challenge.value?.likeCount ?? 0) + (isLiked.value ? 1 : 0))

const scoreDialogVisible = ref<boolean>(false)
const progressDialogVisible = ref<boolean>(false)
const cancelDialogVisible = ref<boolean>(false)

const difficultyText = computed<string>(() => {
  if (!challenge.value) return ''
  const option = challengeDifficultyOptions.find(opt => opt.id === challenge.value?.difficulty)
  return option ? `${option.name} · ${option.description}` : challenge.value.difficulty
})

function onRoleChange(role: ChallengeViewerRole): void {
  roleOverride.value = role
}

function onSortChange(sort: string): void {
  currentSort.value = sort
}

/* ---------------- 互动操作 ---------------- */

function toggleLike(): void {
  isLiked.value = !isLiked.value
}

const { mutateAsync: submitClaim } = useClaimChallenge()
async function handleClaim(): Promise<void> {
  try {
    await submitClaim(challengeId)
    // 揭榜成功后以揭榜人视角重取，服务端已把状态置为 solving
    roleOverride.value = 'claimant'
    ElMessage.success('揭榜成功！难题材料包已开放，可在方案工作区获取')
  } catch (error) {
    ElMessage.error(error instanceof ApiError ? error.message : '揭榜失败，请稍后重试')
  }
}

const { mutateAsync: submitCancelClaim, isPending: cancelSubmitting } = useCancelChallengeClaim()
async function handleCancelClaimConfirm(reason: string): Promise<void> {
  try {
    await submitCancelClaim({ id: challengeId, payload: { reason } })
    // 揭榜关系解除后，当前访问者不再是揭榜人：退回普通用户视角，重新开放「我要揭榜」
    if (viewerRole.value === 'claimant') {
      roleOverride.value = 'visitor'
    }
    cancelDialogVisible.value = false
    ElMessage.success('已取消揭榜，难题重新开放揭榜，已通知发布者与超管')
  } catch (error) {
    ElMessage.error(error instanceof ApiError ? error.message : '取消揭榜失败，请稍后重试')
  }
}

const { mutateAsync: submitScore, isPending: scoreSubmitting } = useScoreChallenge()
async function handleScoreConfirm(score: number, reason: string): Promise<void> {
  try {
    await submitScore({ id: challengeId, payload: { score, reason } })
    scoreDialogVisible.value = false
    ElMessage.success('分值已评定，已通知发布者与揭榜人')
  } catch (error) {
    ElMessage.error(error instanceof ApiError ? error.message : '评分失败，请稍后重试')
  }
}

const { mutateAsync: submitProgress, isPending: progressSubmitting } = useUpdateChallengeProgress()
async function handleProgressConfirm(stage: string, percent: number, note: string): Promise<void> {
  try {
    await submitProgress({ id: challengeId, payload: { stage, percent, note } })
    progressDialogVisible.value = false
    ElMessage.success('进度已更新，发布者已收到通知')
  } catch (error) {
    ElMessage.error(error instanceof ApiError ? error.message : '进度更新失败，请稍后重试')
  }
}

function handlePin(): void {
  ElMessage.success('已将本难题置顶（演示）')
}

function handleRemove(): void {
  ElMessage.warning('删除操作需二次确认，演示环境未开放')
}

function handleEdit(): void {
  ElMessage.info('编辑能力演示：发布者与超管可修改文本，分值调整请使用「评分」入口')
}

function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* ---------------- 评论区（演示态，无对应接口） ---------------- */

function findCommentOrReply(id: string): Comment | Reply | null {
  for (const comment of comments.value) {
    if (comment.id === id) return comment
    const reply = comment.replies.find(item => item.id === id)
    if (reply) return reply
  }
  return null
}

function handleCommentLike(commentId: string): void {
  const target = findCommentOrReply(commentId)
  if (target) {
    target.isLiked = !target.isLiked
    target.likes += target.isLiked ? 1 : -1
  }
}

function handleSubmitComment(): void {
  ElMessage.success('评论已发表（演示）')
}

function handleSubmitReply(): void {
  ElMessage.success('回复已发表（演示）')
}

function handleLoadMore(): void {
  ElMessage.info('暂无更多评论')
}
</script>

<template>
  <div class="pt-16 lg:pt-20 pb-24 lg:pb-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <template v-if="challenge">
        <ChallengeFloatingActions
          :viewer-role="viewerRole"
          :like-count="likeCount"
          :is-liked="isLiked"
          @toggle-like="toggleLike"
          @pin="handlePin"
          @remove="handleRemove"
          @edit="handleEdit"
          @update-progress="progressDialogVisible = true"
          @cancel-claim="cancelDialogVisible = true"
          @scroll-top="scrollToTop"
        />

        <RoleSwitcher :viewer-role="viewerRole" @update:viewer-role="onRoleChange" />

        <ChallengeHeader
          :challenge="challenge"
          :viewer-role="viewerRole"
          @claim="handleClaim"
          @open-score="scoreDialogVisible = true"
        />

        <div class="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
          <!-- 左侧：揭榜进度（桌面端吸附） -->
          <aside class="hidden lg:block">
            <div class="sticky top-24">
              <ProgressPanel :progress-percent="challenge.progressPercent" :timeline="challenge.timeline" />
            </div>
          </aside>

          <div class="min-w-0">
            <!-- 移动端揭榜进度 -->
            <div class="lg:hidden mb-8">
              <ProgressPanel :progress-percent="challenge.progressPercent" :timeline="challenge.timeline" />
            </div>

            <PostContent :html="contentHtml" />

            <CommentSection
              v-if="currentUser"
              :comments="comments"
              :comment-count="challenge.commentCount"
              :sort-options="commentSortOptions"
              :current-sort="currentSort"
              :current-user-avatar="currentUser.avatar"
              @update:current-sort="onSortChange"
              @submit-comment="handleSubmitComment"
              @toggle-like="handleCommentLike"
              @submit-reply="handleSubmitReply"
              @load-more="handleLoadMore"
            />
          </div>
        </div>

        <ScoreDialog
          :visible="scoreDialogVisible"
          :current-score="challenge.score"
          :difficulty-text="difficultyText"
          :has-claimant="Boolean(challenge.claimant)"
          :submitting="scoreSubmitting"
          @close="scoreDialogVisible = false"
          @confirm="handleScoreConfirm"
        />

        <ProgressDialog
          :visible="progressDialogVisible"
          :submitting="progressSubmitting"
          @close="progressDialogVisible = false"
          @confirm="handleProgressConfirm"
        />

        <CancelClaimDialog
          :visible="cancelDialogVisible"
          :submitting="cancelSubmitting"
          @close="cancelDialogVisible = false"
          @confirm="handleCancelClaimConfirm"
        />
      </template>

      <div v-else-if="isError" class="py-24 text-center">
        <p class="text-sm text-muted-foreground mb-4">难题加载失败</p>
        <button
          class="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          @click="refetch()"
        >
          重试
        </button>
      </div>

      <div v-else-if="isPending" class="py-24 text-center text-sm text-muted-foreground">加载中...</div>
    </div>
  </div>
</template>
