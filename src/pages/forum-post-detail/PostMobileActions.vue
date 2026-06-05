<script setup lang="ts">
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  likeCount: number
  commentCount: number
  isLiked: boolean
  isBookmarked: boolean
}>()

defineEmits<{
  toggleLike: []
  scrollToComments: []
  toggleBookmark: []
}>()
</script>

<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border/60 px-4 py-2 flex items-center justify-around">
    <button
      :class="[
        'action-bar-btn flex items-center gap-2 px-4 py-2 rounded-xl',
        isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
      ]"
      @click="$emit('toggleLike')"
    >
      <IconRenderer name="thumbs-up" class="w-5 h-5" />
      <span class="text-sm font-medium">{{ likeCount }}</span>
    </button>
    <button
      class="action-bar-btn flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-primary"
      @click="$emit('scrollToComments')"
    >
      <IconRenderer name="message-square" class="w-5 h-5" />
      <span class="text-sm font-medium">{{ commentCount }}</span>
    </button>
    <button
      :class="[
        'action-bar-btn flex items-center gap-2 px-4 py-2 rounded-xl',
        isBookmarked ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'
      ]"
      @click="$emit('toggleBookmark')"
    >
      <IconRenderer name="bookmark" class="w-5 h-5" />
      <span class="text-sm font-medium">收藏</span>
    </button>
  </div>
</template>

<style scoped>
.action-bar-btn { transition: all 150ms ease-out; }
.action-bar-btn:hover { transform: translateY(-2px); }
</style>
