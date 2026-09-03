<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  claimChallenge,
  fetchChallengeComments,
  fetchChallengeDetail,
  scoreChallenge,
  updateChallengeProgress,
} from '@/api/challenges'
import { ApiError } from '@/api/http'
import type {
  ChallengeDetail,
  ChallengeViewerRole,
} from '@/types/pageDesign/challengeHeroes'
import type { Comment, CommentSortOption, PostAuthor, Reply } from '@/types/pageDesign/forumPostDetail'
import { challengeDifficultyOptions } from '@/data/pageDesign/challengeHeroes'
import PostContent from '@/components/PostContent.vue'
import CommentSection from '@/components/comments/CommentSection.vue'
import ChallengeHeader from './ChallengeHeader.vue'
import ProgressPanel from './ProgressPanel.vue'
import ScoreDialog from './ScoreDialog.vue'
import ProgressDialog from './ProgressDialog.vue'
import ChallengeFloatingActions from './ChallengeFloatingActions.vue'
import RoleSwitcher from './RoleSwitcher.vue'

const route = useRoute()
const challengeId = String(route.params.id)

const challenge = ref<ChallengeDetail | null>(null)
const contentHtml = ref<string>('')
const viewerRole = ref<ChallengeViewerRole>('visitor')
const currentUser = ref<PostAuthor | null>(null)
const loadError = ref<string>('')

const comments = ref<Comment[]>([])
const commentSortOptions = ref<CommentSortOption[]>([])
const currentSort = ref<string>('latest')

const isLiked = ref<boolean>(false)
const likeCount = ref<number>(0)

const scoreDialogVisible = ref<boolean>(false)
const scoreSubmitting = ref<boolean>(false)
const progressDialogVisible = ref<boolean>(false)
const progressSubmitting = ref<boolean>(false)

const difficultyText = computed<string>(() => {
  if (!challenge.value) return ''
  const option = challengeDifficultyOptions.find(opt => opt.id === challenge.value?.difficulty)
  return option ? `${option.name} · ${option.description}` : challenge.value.difficulty
})

async function loadDetail(role?: ChallengeViewerRole): Promise<void> {
  loadError.value = ''
  try {
    const response = await fetchChallengeDetail(challengeId, role)
    challenge.value = response.challenge
    contentHtml.value = response.contentHtml
    viewerRole.value = response.viewerRole
    currentUser.value = response.currentUser
    isLiked.value = false
    likeCount.value = response.challenge.likeCount
  } catch (error) {
    loadError.value = error instanceof ApiError ? error.message : '难题加载失败'
    ElMessage.error(loadError.value)
  }
}

async function loadComments(): Promise<void> {
  try {
    const response = await fetchChallengeComments(challengeId, { sort: currentSort.value })
    comments.value = response.list
    commentSortOptions.value = response.sortOptions
  } catch {
    ElMessage.error('评论加载失败')
  }
}

onMounted(async () => {
  await loadDetail()
  await loadComments()
})

function onRoleChange(role: ChallengeViewerRole): void {
  void loadDetail(role)
}

function onSortChange(sort: string): void {
  currentSort.value = sort
  void loadComments()
}

/* ---------------- 互动操作 ---------------- */

function toggleLike(): void {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

async function handleClaim(): Promise<void> {
  try {
    const { claimant, timeline } = await claimChallenge(challengeId)
    if (challenge.value) {
      challenge.value.claimant = claimant
      challenge.value.timeline = timeline
      challenge.value.status = 'solving'
    }
    viewerRole.value = 'claimant'
    ElMessage.success('揭榜成功！难题材料包已开放，可在方案工作区获取')
  } catch (error) {
    ElMessage.error(error instanceof ApiError ? error.message : '揭榜失败，请稍后重试')
  }
}

async function handleScoreConfirm(score: number, reason: string): Promise<void> {
  scoreSubmitting.value = true
  try {
    const response = await scoreChallenge(challengeId, { score, reason })
    if (challenge.value) {
      challenge.value.score = response.score
      challenge.value.timeline = response.timeline
      if (challenge.value.status === 'scoring') {
        challenge.value.status = 'open'
      }
    }
    scoreDialogVisible.value = false
    ElMessage.success('分值已评定，已通知发布者与揭榜人')
  } catch (error) {
    ElMessage.error(error instanceof ApiError ? error.message : '评分失败，请稍后重试')
  } finally {
    scoreSubmitting.value = false
  }
}

async function handleProgressConfirm(stage: string, percent: number, note: string): Promise<void> {
  progressSubmitting.value = true
  try {
    const response = await updateChallengeProgress(challengeId, { stage, percent, note })
    if (challenge.value) {
      challenge.value.progressPercent = response.progressPercent
      challenge.value.timeline = response.timeline
    }
    progressDialogVisible.value = false
    ElMessage.success('进度已更新，发布者已收到通知')
  } catch (error) {
    ElMessage.error(error instanceof ApiError ? error.message : '进度更新失败，请稍后重试')
  } finally {
    progressSubmitting.value = false
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

/* ---------------- 评论区 ---------------- */

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
      </template>

      <div v-else-if="loadError" class="py-24 text-center">
        <p class="text-sm text-muted-foreground mb-4">{{ loadError }}</p>
        <button
          class="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          @click="loadDetail()"
        >
          重试
        </button>
      </div>

      <div v-else class="py-24 text-center text-sm text-muted-foreground">加载中...</div>
    </div>
  </div>
</template>
