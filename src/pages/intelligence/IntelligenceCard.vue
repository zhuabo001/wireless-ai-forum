<script setup lang="ts">
import { computed } from 'vue'
import type { IntelligenceItem } from '@/types/pageDesign/intelligence'
import IconRenderer from '@/components/ui/IconRenderer.vue'
import { categoryFilters, categoryColorStyles } from '@/data/pageDesign/intelligence'

const props = defineProps<{
  item: IntelligenceItem
}>()

const categoryName = computed(() => {
  const cat = categoryFilters.find((c) => c.id === props.item.categoryId)
  return cat?.name ?? ''
})

const colorClasses = computed(() => {
  return categoryColorStyles[props.item.categoryId] || 'bg-gray-50 text-gray-600'
})
</script>

<template>
  <article
    class="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer group"
  >
    <div class="flex items-start gap-4">
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        :class="colorClasses"
      >
        <IconRenderer :name="item.icon" class="w-5 h-5" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1.5 flex-wrap">
          <span class="text-xs font-medium px-2 py-0.5 rounded" :class="colorClasses">
            {{ categoryName }}
          </span>
          <span class="text-xs text-muted-foreground">{{ item.publishedAt }}</span>
        </div>
        <h3
          class="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2"
        >
          {{ item.title }}
        </h3>
        <p class="text-sm text-muted-foreground line-clamp-2 mb-3">{{ item.summary }}</p>
        <div class="flex items-center justify-between">
          <span class="text-xs text-muted-foreground flex items-center gap-1">
            <IconRenderer name="external-link" class="w-3 h-3" />
            {{ item.source }}
          </span>
          <span class="text-xs font-medium text-primary">阅读全文</span>
        </div>
      </div>
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
