<script setup lang="ts">
import type { PracticeItem } from '@/types/pageDesign/practices'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  item: PracticeItem
}>()

const tagStyleMap: Record<string, string> = {
  '精华': 'bg-blue-50 text-blue-600',
  '模板': 'bg-amber-50 text-amber-600',
  '案例复盘': 'bg-purple-50 text-purple-600',
  '工具链': 'bg-cyan-50 text-cyan-600',
  '协议分析': 'bg-blue-50 text-blue-600',
  '网络优化': 'bg-emerald-50 text-emerald-600',
  '仿真建模': 'bg-indigo-50 text-indigo-600',
  '用例生成': 'bg-green-50 text-green-600',
  '缺陷定位': 'bg-orange-50 text-orange-600',
  '回归分析': 'bg-teal-50 text-teal-600',
  '代码审查': 'bg-rose-50 text-rose-600',
  '知识库问答': 'bg-sky-50 text-sky-600',
  '文档自动化': 'bg-violet-50 text-violet-600',
}
</script>

<template>
  <article class="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer group">
    <div class="flex items-center gap-2 mb-2">
      <span
        v-for="tag in item.tags"
        :key="tag"
        class="px-2 py-0.5 text-xs font-medium rounded-md"
        :class="tagStyleMap[tag] ?? 'bg-gray-50 text-gray-600'"
      >{{ tag }}</span>
    </div>
    <h3 class="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
      {{ item.title }}
    </h3>
    <p class="text-sm text-muted-foreground line-clamp-2 mb-4">
      {{ item.summary }}
    </p>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
          {{ item.author.charAt(0) }}
        </div>
        <div>
          <p class="text-sm font-medium text-foreground">{{ item.author }}</p>
          <p class="text-xs text-muted-foreground">{{ item.time }}</p>
        </div>
      </div>
      <span class="flex items-center gap-1 text-xs text-muted-foreground">
        <IconRenderer name="eye" class="w-3.5 h-3.5" />
        {{ item.views }} 浏览
      </span>
    </div>
  </article>
</template>
