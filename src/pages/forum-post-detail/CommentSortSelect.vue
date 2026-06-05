<script setup lang="ts">
import { ElSelect, ElOption } from 'element-plus'
import type { CommentSortOption } from '@/types/pageDesign/forumPostDetail'

defineProps<{
  modelValue: string
  options: CommentSortOption[]
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex items-center gap-1 text-sm text-muted-foreground sort-select-wrapper">
    <span>排序：</span>
    <ElSelect
      :model-value="modelValue"
      class="sort-select-inline"
      :teleported="false"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <ElOption v-for="opt in options" :key="opt.id" :label="opt.label" :value="opt.id" />
    </ElSelect>
  </div>
</template>

<style scoped>
.sort-select-inline {
  width: 80px;
}
.sort-select-inline :deep(.el-select__wrapper) {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0 4px;
  font-weight: 500;
  color: #0f172a;
}
.sort-select-inline :deep(.el-select__placeholder) {
  color: #0f172a;
  font-weight: 500;
}
.sort-select-inline :deep(.el-select__caret) {
  color: #64748b;
}
</style>
