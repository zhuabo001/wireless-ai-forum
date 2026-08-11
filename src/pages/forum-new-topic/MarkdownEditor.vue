<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLDivElement | null>(null)
let vditor: Vditor | null = null

// 对齐原 md-editor-v3 工具栏能力；vditor 无内置下标/上标按钮，图片通过 markdown 语法插入
const toolbar: string[] = [
  'headings',
  'bold',
  'italic',
  'strike',
  '|',
  'quote',
  'list',
  'ordered-list',
  'check',
  '|',
  'inline-code',
  'code',
  'link',
  'table',
  '|',
  'undo',
  'redo',
  '|',
  'edit-mode',
  'preview',
]

onMounted(() => {
  if (!editorRef.value) return

  vditor = new Vditor(editorRef.value, {
    height: 400,
    mode: 'ir',
    lang: 'zh_CN',
    placeholder: '使用 Markdown 编写你的内容...',
    cache: { enable: false },
    toolbar,
    // vditor 运行时资源（lute/i18n/icons/预览高亮与 mermaid）默认从 unpkg CDN 加载，
    // 内网/离线环境会卡死初始化，这里指向 public 下本地化的 dist 资源
    cdn: '/vditor',
    input: (value: string) => emit('update:modelValue', value),
    after: () => {
      vditor?.setValue(props.modelValue)
    },
  })
})

// 外部（如发布后清空表单）修改 modelValue 时同步进编辑器
watch(
  () => props.modelValue,
  (value: string) => {
    if (vditor && value !== vditor.getValue()) {
      vditor.setValue(value)
    }
  },
)

onBeforeUnmount(() => {
  vditor?.destroy()
  vditor = null
})
</script>

<template>
  <div class="border border-border rounded-xl overflow-hidden">
    <div ref="editorRef" class="custom-md-editor"></div>
  </div>
</template>

<style scoped>
.custom-md-editor {
  height: 400px;
}

.custom-md-editor :deep(.vditor-toolbar) {
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}
</style>
