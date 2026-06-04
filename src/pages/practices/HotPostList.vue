<script setup lang="ts">
import type { HotPost } from '@/types/pageDesign/practices'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  posts: HotPost[]
}>()
</script>

<template>
  <section class="bg-white rounded-xl border border-border p-5">
    <div class="flex items-center gap-2 mb-4">
      <IconRenderer name="flame" class="w-4 h-4 text-orange-500" />
      <h2 class="text-sm font-semibold text-foreground">今日热帖</h2>
    </div>
    <div class="space-y-3">
      <a v-for="post in posts" :key="post.id" href="#" class="block group">
        <p class="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2">
          {{ post.title }}
        </p>
        <p class="text-xs text-muted-foreground mt-1">
          {{ post.views }} 浏览 · {{ post.replies }} 回复
        </p>
      </a>
    </div>
  </section>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
