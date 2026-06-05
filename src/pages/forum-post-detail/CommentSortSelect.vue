<script setup lang="ts">
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
  <div class="flex items-center gap-1 text-sm text-muted-foreground">
    <span>排序：</span>
    <select
      :value="modelValue"
      class="bg-transparent text-foreground font-medium outline-none cursor-pointer"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in options" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
    </select>
  </div>
</template>
