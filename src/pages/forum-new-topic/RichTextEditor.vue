<script setup lang="ts">
import { ref, watch, onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IToolbarConfig, IEditorConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = shallowRef<IDomEditor>()
const isEditorReady = ref<boolean>(false)

const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'bold',
    'italic',
    'underline',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'blockquote',
    'codeBlock',
    'insertLink',
    '|',
    'undo',
    'redo',
  ],
}

const editorConfig: Partial<IEditorConfig> = {
  placeholder: '在这里详细描述你的问题、经验或想法...',
}

function handleCreated(editor: IDomEditor): void {
  editorRef.value = editor
  isEditorReady.value = true
  if (props.modelValue) {
    editor.setHtml(props.modelValue)
  }
}

function handleChange(editor: IDomEditor): void {
  emit('update:modelValue', editor.getHtml())
}

watch(() => props.modelValue, (newVal) => {
  if (editorRef.value && isEditorReady.value && newVal !== editorRef.value.getHtml()) {
    editorRef.value.setHtml(newVal)
  }
})

onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy()
    editorRef.value = undefined
  }
})
</script>

<template>
  <div class="bg-white border border-border rounded-xl overflow-hidden">
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      mode="default"
    />
    <Editor
      :default-config="editorConfig"
      mode="default"
      @on-created="handleCreated"
      @on-change="handleChange"
    />
  </div>
</template>

<style>
.w-e-toolbar {
  border-bottom: 1px solid #e2e8f0 !important;
  background: #f8fafc !important;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}
.w-e-text-container {
  min-height: 240px !important;
  border: none !important;
}
.w-e-text-container [data-slate-editor] {
  min-height: 240px;
  line-height: 1.7;
}
.w-e-text-container [data-slate-editor] p {
  margin-bottom: 0.75rem;
}
.w-e-text-container [data-slate-editor] blockquote {
  border-left: 3px solid #e2e8f0;
  padding-left: 1rem;
  color: #64748b;
}
.w-e-text-container [data-slate-editor] pre {
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-family: 'Fira Code', 'Courier New', monospace;
  overflow-x: auto;
}
.w-e-text-container [data-slate-editor] code {
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.875rem;
}
</style>
