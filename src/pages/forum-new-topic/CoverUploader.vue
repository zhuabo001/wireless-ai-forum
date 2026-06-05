<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { ElUpload, ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import IconRenderer from '@/components/ui/IconRenderer.vue'
import { formLabels } from '@/data/pageDesign/forumNewTopic'

const props = defineProps<{
  modelValue: File | null
  maxSizeMB: number
}>()

const emit = defineEmits<{
  'update:modelValue': [file: File | null]
}>()

const previewUrl = ref<string | null>(null)

watch(() => props.modelValue, (file) => {
  if (!file) {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
    return
  }
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(file)
}, { immediate: true })

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

function handleFileChange(uploadFile: UploadFile): void {
  const file = uploadFile.raw
  if (!file) return
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请上传图片文件')
    return
  }
  if (file.size > props.maxSizeMB * 1024 * 1024) {
    ElMessage.warning(`图片大小不能超过 ${props.maxSizeMB}MB`)
    return
  }
  emit('update:modelValue', file)
}

function handleRemove(): void {
  emit('update:modelValue', null)
}
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-foreground mb-1.5">
      {{ formLabels.coverLabel }}
    </label>
    <ElUpload
      drag
      accept="image/*"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleFileChange"
      class="cover-uploader"
    >
      <div
        v-if="previewUrl"
        class="relative"
      >
        <img
          :src="previewUrl"
          alt="封面预览"
          class="max-h-48 rounded-lg object-cover"
        />
        <button
          type="button"
          class="absolute top-2 right-2 px-2 py-1 text-xs bg-white border border-red-200 text-red-500 rounded-md hover:bg-red-50 transition-colors"
          @click.stop="handleRemove"
        >
          {{ formLabels.coverDeleteText }}
        </button>
      </div>
      <div
        v-else
        class="flex flex-col items-center gap-2"
      >
        <div class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
          <IconRenderer name="image-plus" class="w-5 h-5 text-primary" />
        </div>
        <p class="text-sm text-foreground">{{ formLabels.coverPlaceholder }}</p>
        <p class="text-xs text-muted-foreground">{{ formLabels.coverFormatHint }}</p>
      </div>
    </ElUpload>
  </div>
</template>

<style scoped>
.cover-uploader :deep(.el-upload-dragger) {
  border: 2px dashed #e2e8f0;
  border-radius: 0.75rem;
  background: white;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.cover-uploader :deep(.el-upload-dragger:hover) {
  border-color: rgba(13, 85, 201, 0.4);
  background: rgba(13, 85, 201, 0.05);
}
.cover-uploader :deep(.el-upload) {
  width: 100%;
}
</style>
