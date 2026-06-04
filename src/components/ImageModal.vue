<script setup lang="ts">
import { ElDialog } from 'element-plus'

withDefaults(defineProps<{
  open: boolean
  src: string
  alt?: string
}>(), {
  alt: '',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

function close() {
  emit('update:open', false)
}
</script>

<template>
  <ElDialog
    :model-value="open"
    append-to-body
    class="image-preview-dialog"
    width="min(1024px, calc(100vw - 32px))"
    :show-close="true"
    :lock-scroll="true"
    @close="close"
    @update:model-value="emit('update:open', $event)"
  >
    <img :src="src" :alt="alt" class="w-full h-full object-contain" style="max-height: 85vh;" />
  </ElDialog>
</template>
