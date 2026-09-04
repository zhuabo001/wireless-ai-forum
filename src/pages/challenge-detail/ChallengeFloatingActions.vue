<script setup lang="ts">
import type { ChallengeViewerRole } from '@/types/pageDesign/challengeHeroes'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  viewerRole: ChallengeViewerRole
  likeCount: number
  isLiked: boolean
}>()

const emit = defineEmits<{
  toggleLike: []
  pin: []
  remove: []
  edit: []
  updateProgress: []
  cancelClaim: []
  scrollTop: []
}>()
</script>

<template>
  <!-- 桌面端右侧浮动操作栏 -->
  <div class="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3">
    <div class="bg-white rounded-2xl shadow-lg border border-border/60 p-2 flex flex-col items-center gap-1">
      <!-- 发布者 / 超管：置顶、删除、编辑 -->
      <template v-if="viewerRole === 'publisher' || viewerRole === 'admin'">
        <button class="action-bar-btn w-12 h-12 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5" title="置顶" @click="emit('pin')">
          <IconRenderer name="pin" class="w-5 h-5" />
          <span class="text-[10px] font-medium mt-0.5">置顶</span>
        </button>
        <button class="action-bar-btn w-12 h-12 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50" title="删除" @click="emit('remove')">
          <IconRenderer name="trash-2" class="w-5 h-5" />
          <span class="text-[10px] font-medium mt-0.5">删除</span>
        </button>
        <button class="action-bar-btn w-12 h-12 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5" title="编辑" @click="emit('edit')">
          <IconRenderer name="pencil" class="w-5 h-5" />
          <span class="text-[10px] font-medium mt-0.5">编辑</span>
        </button>
        <div class="w-8 h-px bg-border/60"></div>
      </template>
      <!-- 揭榜人：更新进度 / 取消揭榜 -->
      <template v-else-if="viewerRole === 'claimant'">
        <button class="action-bar-btn w-12 h-12 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5" title="更新进度" @click="emit('updateProgress')">
          <IconRenderer name="flag" class="w-5 h-5" />
          <span class="text-[10px] font-medium mt-0.5">进度</span>
        </button>
        <button class="action-bar-btn w-12 h-12 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50" title="取消揭榜" @click="emit('cancelClaim')">
          <IconRenderer name="flag-off" class="w-5 h-5" />
          <span class="text-[10px] font-medium mt-0.5">取消揭榜</span>
        </button>
        <div class="w-8 h-px bg-border/60"></div>
      </template>
      <!-- 全员 -->
      <button
        :class="['action-bar-btn w-12 h-12 rounded-xl flex flex-col items-center justify-center', isLiked ? 'text-rose-500 bg-rose-50' : 'text-muted-foreground hover:text-rose-500 hover:bg-rose-50']"
        title="认为有用"
        @click="emit('toggleLike')"
      >
        <IconRenderer name="thumbs-up" class="w-5 h-5" />
        <span class="text-[10px] font-medium mt-0.5">{{ likeCount }}</span>
      </button>
      <div class="w-8 h-px bg-border/60"></div>
      <button class="action-bar-btn w-12 h-12 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5" title="回到顶部" @click="emit('scrollTop')">
        <IconRenderer name="arrow-up" class="w-5 h-5" />
        <span class="text-[10px] font-medium mt-0.5">顶部</span>
      </button>
    </div>
  </div>

  <!-- 移动端底部操作栏 -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border/60 px-4 py-2 flex items-center justify-around">
    <button
      :class="['flex items-center gap-2 px-4 py-2 rounded-xl', isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500']"
      @click="emit('toggleLike')"
    >
      <IconRenderer name="thumbs-up" class="w-5 h-5" />
      <span class="text-sm font-medium">{{ likeCount }}</span>
    </button>
    <button class="flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-primary" @click="emit('scrollTop')">
      <IconRenderer name="arrow-up" class="w-5 h-5" />
      <span class="text-sm font-medium">顶部</span>
    </button>
  </div>
</template>

<style scoped>
.action-bar-btn {
  transition: all 150ms ease-out;
}
.action-bar-btn:hover {
  transform: translateY(-2px);
}
@media (prefers-reduced-motion: reduce) {
  .action-bar-btn { transition: none; }
  .action-bar-btn:hover { transform: none; }
}
</style>
