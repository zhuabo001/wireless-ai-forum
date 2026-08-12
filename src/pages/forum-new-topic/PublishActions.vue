<script setup lang="ts">
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  noticeText: string
  cancelLink: string
  cancelText: string
  submitText: string
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()
</script>

<template>
  <div class="flex items-center justify-between pt-4 border-t border-border">
    <div class="flex items-center gap-2 text-sm text-muted-foreground">
      <IconRenderer name="info" class="w-4 h-4" />
      <span>{{ noticeText }}</span>
    </div>
    <div class="flex items-center gap-3">
      <router-link
        :to="cancelLink"
        class="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
        @click="emit('cancel')"
      >
        {{ cancelText }}
      </router-link>
      <ElButton
        type="primary"
        :loading="isSubmitting"
        @click="emit('submit')"
      >
        {{ submitText }}
      </ElButton>
    </div>
  </div>
</template>
