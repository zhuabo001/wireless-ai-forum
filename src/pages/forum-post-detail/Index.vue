<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Comment, Reply } from '@/types/pageDesign/forumPostDetail'
import {
  postDetail,
  postContentHtml,
  resourceLinks,
  commentSortOptions,
  comments as initialComments,
  sourcePageConfig,
  defaultSource,
  currentUser,
} from '@/data/pageDesign/forumPostDetail'
import PostHeader from './PostHeader.vue'
import PostContent from './PostContent.vue'
import PostResourceLinks from './PostResourceLinks.vue'
import PostFloatingActions from './PostFloatingActions.vue'
import PostMobileActions from './PostMobileActions.vue'
import CommentSection from './CommentSection.vue'

const isLiked = ref<boolean>(false)
const isBookmarked = ref<boolean>(false)
const likeCount = ref<number>(postDetail.likeCount)
const comments = ref<Comment[]>(initialComments)
const currentSort = ref<string>('hottest')

const route = useRoute()
const sourcePage = (route.query.from as string) || defaultSource
const sourceConfig = computed(() => sourcePageConfig[sourcePage] ?? sourcePageConfig[defaultSource])
const dynamicBackLink = computed<string>(() => sourceConfig.value.href)
const dynamicBackTitle = computed<string>(() => sourceConfig.value.label)

function toggleLike(): void {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

function toggleBookmark(): void {
  isBookmarked.value = !isBookmarked.value
}

function scrollToComments(): void {
  document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function findCommentOrReply(id: string): Comment | Reply | null {
  for (const comment of comments.value) {
    if (comment.id === id) return comment
    for (const reply of comment.replies) {
      if (reply.id === id) return reply
    }
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
  <div class="pt-16 lg:pt-20 pb-20 lg:pb-12">
    <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <PostFloatingActions
        :like-count="likeCount"
        :comment-count="postDetail.commentCount"
        :is-liked="isLiked"
        :is-bookmarked="isBookmarked"
        @toggle-like="toggleLike"
        @scroll-to-comments="scrollToComments"
        @toggle-bookmark="toggleBookmark"
      />

      <PostMobileActions
        :like-count="likeCount"
        :comment-count="postDetail.commentCount"
        :is-liked="isLiked"
        :is-bookmarked="isBookmarked"
        @toggle-like="toggleLike"
        @scroll-to-comments="scrollToComments"
        @toggle-bookmark="toggleBookmark"
      />

      <PostHeader
        :back-link="dynamicBackLink"
        :back-title="dynamicBackTitle"
        :categories="postDetail.categories"
        :title="postDetail.title"
        :author="postDetail.author"
        :publish-date="postDetail.publishDate"
        :view-count="postDetail.viewCount"
        :comment-count="postDetail.commentCount"
      />

      <PostContent :html="postContentHtml" />

      <PostResourceLinks :links="resourceLinks" />

      <CommentSection
        :comments="comments"
        :comment-count="postDetail.commentCount"
        :sort-options="commentSortOptions"
        :current-sort="currentSort"
        :current-user-avatar="currentUser.avatar"
        @update:current-sort="currentSort = $event"
        @submit-comment="handleSubmitComment"
        @toggle-like="handleCommentLike"
        @submit-reply="handleSubmitReply"
        @load-more="handleLoadMore"
      />
    </main>
  </div>
</template>
