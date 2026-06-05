<script setup lang="ts">
import { formLabels } from '@/data/pageDesign/forumNewTopic'

defineProps<{
  modelValue: string
  maxLength: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-foreground mb-1.5">
      {{ formLabels.summaryLabel }}
    </label>
    <textarea
      :value="modelValue"
      :maxlength="maxLength"
      :placeholder="formLabels.summaryPlaceholder"
      rows="3"
      class="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white resize-none"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <div class="text-right text-xs text-muted-foreground mt-1">
      {{ modelValue.length }}/{{ maxLength }}
    </div>
  </div>
</template>
