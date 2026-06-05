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
  <div class="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3">
    <div class="bg-white rounded-2xl shadow-lg border border-border/60 p-2 flex flex-col items-center gap-1">
      <button
        :class="[
          'action-bar-btn w-12 h-12 rounded-xl flex flex-col items-center justify-center',
          isLiked ? 'text-rose-500 bg-rose-50 active' : 'text-muted-foreground hover:text-rose-500 hover:bg-rose-50'
        ]"
        @click="handleToggleLike"
      >
        <IconRenderer :class="['w-5 h-5', { 'heart-anim': heartAnimating }]" name="thumbs-up" />
        <span class="text-[10px] font-medium mt-0.5">{{ likeCount }}</span>
      </button>
      <div class="w-8 h-px bg-border/60"></div>
      <button
        class="action-bar-btn w-12 h-12 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5"
        @click="$emit('scrollToComments')"
      >
        <IconRenderer name="message-square" class="w-5 h-5" />
        <span class="text-[10px] font-medium mt-0.5">{{ commentCount }}</span>
      </button>
      <div class="w-8 h-px bg-border/60"></div>
      <button
        :class="[
          'action-bar-btn w-12 h-12 rounded-xl flex flex-col items-center justify-center',
          isBookmarked ? 'text-amber-500 bg-amber-50 active' : 'text-muted-foreground hover:text-amber-500 hover:bg-amber-50'
        ]"
        @click="$emit('toggleBookmark')"
      >
        <IconRenderer name="bookmark" class="w-5 h-5" />
        <span class="text-[10px] font-medium mt-0.5">收藏</span>
      </button>
    </div>
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

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
</style>
