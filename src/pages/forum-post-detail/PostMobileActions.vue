<script setup lang="ts">
import { ref } from 'vue'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  likeCount: number
  commentCount: number
  isLiked: boolean
  isBookmarked: boolean
}>()

const emit = defineEmits<{
  toggleLike: []
  scrollToComments: []
  toggleBookmark: []
}>()

const heartAnimating = ref<boolean>(false)

function handleToggleLike(): void {
  emit('toggleLike')
  heartAnimating.value = true
  setTimeout(() => {
    heartAnimating.value = false
  }, 300)
}
</script>

<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border/60 px-4 py-2 flex items-center justify-around">
    <button
      :class="[
        'action-bar-btn flex items-center gap-2 px-4 py-2 rounded-xl',
        isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
      ]"
      @click="handleToggleLike"
    >
      <IconRenderer :class="['w-5 h-5', { 'heart-anim': heartAnimating }]" name="thumbs-up" />
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

@keyframes heart-burst {
  0% { transform: scale(1); }
  30% { transform: scale(1.3); }
  60% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
.heart-anim { animation: heart-burst 300ms ease-out; }

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
</style>
