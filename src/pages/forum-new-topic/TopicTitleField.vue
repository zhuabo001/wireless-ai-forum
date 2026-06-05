<script setup lang="ts">
import { formLabels } from '@/data/pageDesign/forumNewTopic'

defineProps<{
  modelValue: string
  maxLength: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-foreground mb-1.5">
      {{ formLabels.titleLabel }} <span class="text-red-500">*</span>
    </label>
    <input
      type="text"
      :value="modelValue"
      :maxlength="maxLength"
      :placeholder="formLabels.titlePlaceholder"
      class="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
      @input="onInput"
    />
    <div class="text-right text-xs text-muted-foreground mt-1">
      {{ modelValue.length }}/{{ maxLength }}
    </div>
  </div>
</template>
