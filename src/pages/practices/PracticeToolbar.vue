<script setup lang="ts">
import { ElButton } from 'element-plus'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  categoryName: string
  categoryCount: number
  activeCategoryId: string
}>()
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div>
      <p class="text-sm font-medium text-foreground">{{ categoryName }}</p>
      <p class="text-xs text-muted-foreground mt-1">当前筛选 {{ categoryCount }} 篇，按最新发布排序</p>
    </div>
    <ElButton size="small" class="!inline-flex !items-center gap-2">
      <IconRenderer name="sliders-horizontal" class="w-4 h-4" />
      筛选
    </ElButton>
  </div>
</template>
