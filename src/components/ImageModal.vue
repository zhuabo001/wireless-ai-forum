<script setup lang="ts">
import IconRenderer from './ui/IconRenderer.vue'

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
    :show-close="false"
    :lock-scroll="true"
    @close="close"
    @update:model-value="emit('update:open', $event)"
  >
    <div class="relative">
      <button
        type="button"
        aria-label="关闭大图"
        class="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        @click="close"
      >
        <IconRenderer name="x" class-name="w-4 h-4" />
      </button>
      <img :src="src" :alt="alt" class="w-full h-full object-contain" style="max-height: 85vh;" />
    </div>
  </ElDialog>
</template>
