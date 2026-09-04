<script setup lang="ts">
import type { Comment, CommentSortOption } from '@/types/pageDesign/forumPostDetail'
import CommentSortSelect from './CommentSortSelect.vue'
import CommentEditor from './CommentEditor.vue'
import CommentList from './CommentList.vue'

defineProps<{
  comments: Comment[]
  commentCount: number
  sortOptions: CommentSortOption[]
  currentSort: string
  currentUserAvatar: string
}>()

defineEmits<{
  'update:currentSort': [value: string]
  submitComment: [html: string]
  toggleLike: [commentId: string]
  submitReply: [commentId: string, html: string]
  loadMore: []
}>()
</script>

<template>
  <section id="comments" class="border-t border-border pt-10">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-xl font-bold text-foreground">
        评论 <span class="text-muted-foreground font-normal text-base">({{ commentCount }})</span>
      </h2>
      <CommentSortSelect
        :model-value="currentSort"
        :options="sortOptions"
        @update:model-value="$emit('update:currentSort', $event)"
      />
    </div>

    <CommentEditor @submit="$emit('submitComment', $event)" />

    <CommentList
      :comments="comments"
      :current-user-avatar="currentUserAvatar"
      @toggle-like="$emit('toggleLike', $event)"
      @submit-reply="$emit('submitReply', $event[0], $event[1])"
      @load-more="$emit('loadMore')"
    />
  </section>
</template>
