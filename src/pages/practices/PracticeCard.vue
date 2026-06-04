<script setup lang="ts">
import type { PracticeItem } from '@/types/pageDesign/practices'
import IconRenderer from '@/components/ui/IconRenderer.vue'
import { tagStyles } from '@/data/pageDesign/practices'

defineProps<{
  practice: PracticeItem
}>()
</script>

<template>
  <article
    class="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer group"
  >
    <div class="flex items-center gap-2 mb-2">
      <span class="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-md">
        协议分析
      </span>
      <span
        v-for="tag in practice.tags"
        :key="tag"
        class="px-2 py-0.5 text-xs font-medium rounded-md"
        :class="tagStyles[tag] || 'bg-gray-50 text-gray-600'"
      >
        {{ tag }}
      </span>
    </div>
    <h3 class="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
      {{ practice.title }}
    </h3>
    <p class="text-sm text-muted-foreground line-clamp-2 mb-4">{{ practice.summary }}</p>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <img
          :src="practice.authorAvatar"
          :alt="practice.author"
          class="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p class="text-sm font-medium text-foreground">{{ practice.author }}</p>
          <p class="text-xs text-muted-foreground">{{ practice.date }}</p>
        </div>
      </div>
      <span class="flex items-center gap-1 text-xs text-muted-foreground">
        <IconRenderer name="eye" class="w-3.5 h-3.5" />
        {{ practice.views.toLocaleString() }} 浏览
      </span>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
