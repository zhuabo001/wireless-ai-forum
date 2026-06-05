<script setup lang="ts">
import { ref } from 'vue'
import { ElSelect, ElOption, ElTag } from 'element-plus'
import type { PresetTag } from '@/types/pageDesign/forumNewTopic'
import { formLabels } from '@/data/pageDesign/forumNewTopic'

const props = defineProps<{
  modelValue: string[]
  presetTags: PresetTag[]
  maxTags: number
}>()

const emit = defineEmits<{
  'update:modelValue': [tags: string[]]
}>()

const inputValue = ref<string>('')
const presetSelectValue = ref<string>('')

function addTag(tag: string): void {
  const trimmed = tag.trim()
  if (!trimmed) return
  if (props.modelValue.length >= props.maxTags) return
  if (props.modelValue.includes(trimmed)) return
  emit('update:modelValue', [...props.modelValue, trimmed])
}

function removeTag(index: number): void {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}

function handlePresetTagChange(value: string): void {
  if (value) {
    addTag(value)
    presetSelectValue.value = ''
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addTag(inputValue.value)
    inputValue.value = ''
  }
  if (event.key === 'Backspace' && inputValue.value === '' && props.modelValue.length > 0) {
    removeTag(props.modelValue.length - 1)
  }
}
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-foreground mb-1.5">
      {{ formLabels.tagLabel }}
    </label>
    <div class="space-y-2">
      <ElSelect
        v-model="presetSelectValue"
        :placeholder="formLabels.tagPresetPlaceholder"
        class="w-full tag-preset-select"
        @change="handlePresetTagChange"
      >
        <ElOption
          v-for="tag in presetTags"
          :key="tag.id"
          :label="tag.name"
          :value="tag.id"
        />
      </ElSelect>
      <div class="w-full px-3 py-2 text-sm border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-colors bg-white flex flex-wrap items-center gap-1.5">
        <ElTag
          v-for="(tag, index) in modelValue"
          :key="tag"
          closable
          size="small"
          class="tag-pill"
          @close="removeTag(index)"
        >
          {{ tag }}
        </ElTag>
        <input
          v-model="inputValue"
          type="text"
          :placeholder="modelValue.length >= maxTags ? '' : formLabels.tagPlaceholder"
          class="flex-1 min-w-[120px] text-sm outline-none border-none bg-transparent"
          @keydown="handleKeydown"
        />
      </div>
    </div>
    <p class="text-xs text-muted-foreground mt-1">
      {{ formLabels.tagHelperText }}
    </p>
  </div>
</template>

<style scoped>
.tag-preset-select :deep(.el-select__wrapper) {
  border-radius: 0.75rem;
  box-shadow: none;
  border: 1px solid #e2e8f0;
  height: 42px;
}
.tag-preset-select :deep(.el-select__wrapper.is-focus) {
  border-color: #0d55c9;
  box-shadow: 0 0 0 2px rgba(13, 85, 201, 0.2);
}
.tag-pill {
  animation: tagIn 0.15s ease-out;
}
@keyframes tagIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .tag-pill {
    animation: none;
  }
}
</style>
