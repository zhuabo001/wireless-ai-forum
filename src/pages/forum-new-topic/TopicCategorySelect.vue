<script setup lang="ts">
import { ElSelect, ElOption } from 'element-plus'
import type { TopicCategory } from '@/types/pageDesign/forumNewTopic'
import { formLabels } from '@/data/pageDesign/forumNewTopic'

defineProps<{
  modelValue: string
  options: TopicCategory[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-foreground mb-1.5">
      {{ formLabels.categoryLabel }} <span class="text-red-500">*</span>
    </label>
    <ElSelect
      :model-value="modelValue"
      :placeholder="formLabels.categoryPlaceholder"
      class="w-full category-select"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <ElOption
        v-for="opt in options"
        :key="opt.id"
        :label="opt.name"
        :value="opt.id"
      />
    </ElSelect>
  </div>
</template>

<style scoped>
.category-select :deep(.el-select__wrapper) {
  border-radius: 0.75rem;
  box-shadow: none;
  border: 1px solid #e2e8f0;
  height: 42px;
}
.category-select :deep(.el-select__wrapper.is-focus) {
  border-color: #0d55c9;
  box-shadow: 0 0 0 2px rgba(13, 85, 201, 0.2);
}
</style>
