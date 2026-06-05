<script setup lang="ts">
import { computed } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const mdValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
})

const toolbars: string[] = [
  'bold',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'revoke',
  'next',
  'save',
  'preview',
]
</script>

<template>
  <div class="border border-border rounded-xl overflow-hidden">
    <MdEditor
      v-model="mdValue"
      :toolbars="toolbars"
      theme="light"
      preview-theme="default"
      placeholder="使用 Markdown 编写你的内容..."
      language="zh-CN"
      class="custom-md-editor"
    />
  </div>
</template>

<style>
.custom-md-editor {
  height: 400px;
}
.custom-md-editor .md-editor-toolbar {
  border-bottom: 1px solid #e2e8f0 !important;
  background: #f8fafc !important;
  border-radius: 0.75rem 0.75rem 0 0;
}
.custom-md-editor .md-editor-content {
  min-height: 240px;
}
</style>
