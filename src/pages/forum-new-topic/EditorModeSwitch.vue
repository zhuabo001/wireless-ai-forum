<script setup lang="ts">
import type { EditorMode, EditorModeId } from '@/types/pageDesign/forumNewTopic'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  modelValue: EditorModeId
  modes: EditorMode[]
}>()

const emit = defineEmits<{
  'update:modelValue': [mode: EditorModeId]
}>()
</script>

<template>
  <div class="inline-flex bg-white border border-border rounded-lg p-0.5">
    <button
      v-for="mode in modes"
      :key="mode.id"
      type="button"
      :class="[
        'px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5',
        modelValue === mode.id
          ? 'bg-primary text-white'
          : 'text-muted-foreground hover:text-foreground',
      ]"
      @click="emit('update:modelValue', mode.id)"
    >
      <IconRenderer :name="mode.icon" class="w-3.5 h-3.5" />
      {{ mode.label }}
    </button>
  </div>
</template>
