<script setup lang="ts">
import type { PracticeItem } from '@/types/pageDesign/practices'
import { ElTag, ElAvatar } from 'element-plus'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  item: PracticeItem
}>()

const tagStyleMap: Record<string, string> = {
  '精华': '#eff6ff',
  '模板': '#fffbeb',
  '案例复盘': '#faf5ff',
  '工具链': '#ecfeff',
  '协议分析': '#eff6ff',
  '网络优化': '#ecfdf5',
  '仿真建模': '#eef2ff',
  '用例生成': '#f0fdf4',
  '缺陷定位': '#fff7ed',
  '回归分析': '#f0fdfa',
  '代码审查': '#fff1f2',
  '知识库问答': '#f0f9ff',
  '文档自动化': '#f5f3ff',
}

const tagTextStyleMap: Record<string, string> = {
  '精华': '#2563eb',
  '模板': '#d97706',
  '案例复盘': '#9333ea',
  '工具链': '#0891b2',
  '协议分析': '#2563eb',
  '网络优化': '#059669',
  '仿真建模': '#4f46e5',
  '用例生成': '#16a34a',
  '缺陷定位': '#ea580c',
  '回归分析': '#0d9488',
  '代码审查': '#e11d48',
  '知识库问答': '#0284c7',
  '文档自动化': '#7c3aed',
}
</script>

<template>
  <article class="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer group">
    <div class="flex items-center gap-2 mb-2">
      <ElTag
        v-for="tag in item.tags"
        :key="tag"
        :color="tagStyleMap[tag] ?? '#f3f4f6'"
        :style="{ color: tagTextStyleMap[tag] ?? '#4b5563', border: 'none' }"
        size="small"
      >{{ tag }}</ElTag>
    </div>
    <h3 class="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
      {{ item.title }}
    </h3>
    <p class="text-sm text-muted-foreground line-clamp-2 mb-4">
      {{ item.summary }}
    </p>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <ElAvatar :size="32" class="!bg-gradient-to-br !from-primary !to-indigo-600 !text-white !text-xs !font-medium">
          {{ item.author.charAt(0) }}
        </ElAvatar>
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
