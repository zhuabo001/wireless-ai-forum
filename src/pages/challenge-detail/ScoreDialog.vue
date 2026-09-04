<script setup lang="ts">
import { ref, watch } from 'vue'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const props = defineProps<{
  visible: boolean
  /** 当前已定分值；null 表示尚未评定 */
  currentScore: number | null
  /** 发布者难度自评（展示名），供定分参考 */
  difficultyText: string
  /** 是否已有人揭榜（已揭榜调分需额外警示） */
  hasClaimant: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: [score: number, reason: string]
}>()

const PRESET_SCORES = [100, 200, 300, 500, 800]

const scoreInput = ref<string>('')
const reason = ref<string>('')

watch(
  () => props.visible,
  visible => {
    if (visible) {
      scoreInput.value = props.currentScore !== null ? String(props.currentScore) : ''
      reason.value = ''
    }
  },
)

function setScore(value: number): void {
  scoreInput.value = String(value)
}

function handleConfirm(): void {
  const score = Number(scoreInput.value)
  if (!Number.isInteger(score) || score < 50 || score > 2000) {
    ElMessage.warning('请填写有效分值（50–2000）')
    return
  }
  if (!reason.value.trim()) {
    ElMessage.warning('请填写评定理由')
    return
  }
  emit('confirm', score, reason.value.trim())
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40" @click="emit('close')"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-foreground">{{ currentScore === null ? '评定悬赏分值' : '调整悬赏分值' }}</h3>
            <p v-if="currentScore !== null" class="text-xs text-muted-foreground mt-1">
              当前分值 <span class="font-semibold text-amber-600">{{ currentScore }} 分</span>
            </p>
          </div>
          <button class="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors" @click="emit('close')">
            <IconRenderer name="x" class="w-4 h-4" />
          </button>
        </div>

        <!-- 定分参考 -->
        <div class="bg-muted/50 rounded-xl px-4 py-3 mb-4">
          <p class="text-xs font-medium text-foreground mb-1.5">定分参考</p>
          <div class="space-y-1 text-xs text-muted-foreground">
            <p class="flex items-center gap-1.5">
              <IconRenderer name="gauge" class="w-3.5 h-3.5 flex-shrink-0" />发布者难度自评：{{ difficultyText }}
            </p>
            <p class="flex items-center gap-1.5">
              <IconRenderer name="lightbulb" class="w-3.5 h-3.5 flex-shrink-0" />系统建议区间：500 – 800 分
            </p>
          </div>
        </div>

        <!-- 分值选择 -->
        <label class="block text-sm font-medium text-foreground mb-2">评定分值 <span class="text-red-500">*</span></label>
        <div class="flex flex-wrap gap-2 mb-2">
          <button
            v-for="preset in PRESET_SCORES"
            :key="preset"
            type="button"
            :class="[
              'px-2.5 py-1 text-xs font-medium border rounded-md transition-colors',
              Number(scoreInput) === preset
                ? 'bg-primary/10 text-primary border-primary/40'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary',
            ]"
            @click="setScore(preset)"
          >
            {{ preset }}
          </button>
        </div>
        <input
          v-model="scoreInput"
          type="number"
          placeholder="或输入自定义分值（50–2000）"
          min="50"
          max="2000"
          step="50"
          class="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors mb-4"
        >

        <!-- 评定理由 -->
        <label class="block text-sm font-medium text-foreground mb-2">评定理由 <span class="text-red-500">*</span></label>
        <textarea
          v-model="reason"
          rows="3"
          placeholder="说明定分或调分依据，将记录到揭榜进度并通知相关人"
          class="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none mb-3"
        ></textarea>

        <!-- 已揭榜警告 -->
        <div v-if="hasClaimant" class="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2.5 mb-4">
          <IconRenderer name="alert-triangle" class="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>该题已有人揭榜，调整分值将通知发布者与揭榜人，并作为操作记录写入揭榜进度。结题后分值不可再调整。</span>
        </div>

        <div class="flex justify-end gap-3">
          <button class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors" @click="emit('close')">
            取消
          </button>
          <button
            :disabled="submitting"
            class="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            @click="handleConfirm"
          >
            {{ submitting ? '提交中...' : currentScore === null ? '确认评定' : '确认调整' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
