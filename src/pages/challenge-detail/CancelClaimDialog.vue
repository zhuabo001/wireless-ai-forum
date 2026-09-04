<script setup lang="ts">
import { ref, watch } from 'vue'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const props = defineProps<{
  visible: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: [reason: string]
}>()

const reason = ref<string>('')

watch(
  () => props.visible,
  visible => {
    if (visible) {
      reason.value = ''
    }
  },
)

function handleConfirm(): void {
  if (!reason.value.trim()) {
    ElMessage.warning('请填写取消原因')
    return
  }
  emit('confirm', reason.value.trim())
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40" @click="emit('close')"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-foreground">取消揭榜</h3>
            <p class="text-xs text-muted-foreground mt-1">请谨慎操作，取消后本题将重新开放揭榜</p>
          </div>
          <button class="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors" @click="emit('close')">
            <IconRenderer name="x" class="w-4 h-4" />
          </button>
        </div>

        <!-- 影响说明 -->
        <div class="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2.5 mb-4">
          <IconRenderer name="alert-triangle" class="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>取消后本题状态退回「揭榜中」，「我要揭榜」重新对他人开放；你的解题进度清零（历史操作记录保留在揭榜进度中），本次操作将通知发布者与超管。</span>
        </div>

        <label class="block text-sm font-medium text-foreground mb-2">取消原因 <span class="text-red-500">*</span></label>
        <textarea
          v-model="reason"
          rows="3"
          placeholder="说明取消原因，将写入揭榜进度留痕，例如：排期冲突，无法在承诺期内完成验证"
          class="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none mb-4"
        ></textarea>

        <div class="flex justify-end gap-3">
          <button class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors" @click="emit('close')">
            再想想
          </button>
          <button
            :disabled="submitting"
            class="px-5 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            @click="handleConfirm"
          >
            {{ submitting ? '提交中...' : '确认取消揭榜' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
