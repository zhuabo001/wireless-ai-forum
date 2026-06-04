<script setup lang="ts">
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  currentCategoryName: string
  filteredCount: number
  sortLabel: string
}>()

defineEmits<{
  filter: []
}>()
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div>
      <p class="text-sm font-medium text-foreground">{{ currentCategoryName }}</p>
      <p class="text-xs text-muted-foreground mt-1">
        当前筛选 {{ filteredCount }} 篇，按{{ sortLabel }}排序
      </p>
    </div>
    <button
      class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white border border-border text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors"
      @click="$emit('filter')"
    >
      <IconRenderer name="sliders-horizontal" class="w-4 h-4" />
      筛选
    </button>
  </div>
</template>
