<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount, nextTick } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'

const emit = defineEmits<{
  submit: [html: string]
}>()

const editorRef = shallowRef<IDomEditor | null>(null)
const hasContent = ref<boolean>(false)

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: [
    'headerSelect', 'fontSize', 'fontFamily', 'lineHeight',
    'foreColor', 'backColor', 'emotion', 'fullScreen',
    'insertImage', 'insertVideo', 'insertTable', 'divider',
    'clearStyle', 'group-video', 'group-image',
    'through', 'sup', 'sub', 'justifyLeft', 'justifyRight',
    'justifyCenter', 'justifyJustify',
  ],
}

const editorConfig = {
  placeholder: '分享你的观点、经验或疑问...',
  autoFocus: false,
  MENU_CONF: {},
}

function handleCreated(editor: IDomEditor): void {
  editorRef.value = editor
  nextTick(() => {
    editor.focus()
  })
}

function handleChange(editor: IDomEditor): void {
  hasContent.value = editor.getText().trim().length > 0
}

function handleSubmit(): void {
  const editor = editorRef.value
  if (!editor) return
  const html = editor.getHtml()
  const text = editor.getText()
  if (!text.trim()) return
  emit('submit', html)
  editor.clear()
  hasContent.value = false
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) {
    editor.destroy()
    editorRef.value = null
  }
})
</script>

<template>
  <div class="bg-white rounded-xl border border-border p-4 mb-10">
    <div class="flex items-start gap-3 mb-3">
      <img
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
        alt="我"
        class="w-9 h-9 rounded-full bg-muted border border-border flex-shrink-0"
      >
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-foreground mb-2">发表评论</div>
        <Toolbar
          :editor="editorRef"
          :default-config="toolbarConfig"
          mode="simple"
          class="comment-toolbar border border-border rounded-lg bg-muted/30 mb-2"
        />
        <Editor
          :default-config="editorConfig"
          mode="simple"
          class="comment-editor-wrapper"
          @onCreated="handleCreated"
          @onChange="handleChange"
        />
      </div>
    </div>
    <div class="flex justify-end">
      <button
        class="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        @click="handleSubmit"
      >
        发表评论
      </button>
    </div>
  </div>
</template>

<style>
.comment-toolbar {
  padding: 4px 8px;
}
.comment-toolbar .w-e-toolbar {
  border: none;
  background: transparent;
}
.comment-toolbar .w-e-bar-item button {
  padding: 4px 6px;
  border-radius: 4px;
  color: #64748b;
}
.comment-toolbar .w-e-bar-item button:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.comment-editor-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
}
.comment-editor-wrapper .w-e-text-container {
  border: none;
  border-radius: 0.5rem;
  background: white;
}
.comment-editor-wrapper .w-e-text-container [data-slate-editor] {
  min-height: 100px;
  padding: 10px 12px;
  line-height: 1.7;
  font-size: 0.875rem;
}
.comment-editor-wrapper .w-e-text-placeholder {
  top: 10px;
  left: 12px;
  font-size: 0.875rem;
  color: #94a3b8;
}
</style>
