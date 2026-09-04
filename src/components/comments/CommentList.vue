<script setup lang="ts">
import type { Comment } from '@/types/pageDesign/forumPostDetail'
import CommentItem from './CommentItem.vue'

defineProps<{
  comments: Comment[]
  currentUserAvatar: string
}>()

defineEmits<{
  toggleLike: [commentId: string]
  submitReply: [commentId: string, html: string]
  loadMore: []
}>()
</script>

<template>
  <div class="space-y-6">
    <CommentItem
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :current-user-avatar="currentUserAvatar"
      @toggle-like="$emit('toggleLike', $event)"
      @submit-reply="$emit('submitReply', $event[0], $event[1])"
    />
  </div>

  <div class="text-center mt-8">
    <button
      class="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground bg-white border border-border rounded-xl hover:bg-muted transition-colors"
      @click="$emit('loadMore')"
    >
      加载更多评论
    </button>
  </div>
</template>
