<script setup lang="ts">
import { ref, watch } from 'vue'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const props = defineProps<{
  visible: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: [stage: string, percent: number, note: string]
}>()

const STAGES = [
  { name: '方案设计中', percent: 20 },
  { name: '方案已提交，待发布者确认', percent: 50 },
  { name: '试点验证中', percent: 75 },
  { name: '申请验收，待发布者结题', percent: 90 },
]

const selectedStage = ref<string>(STAGES[2].name)
const note = ref<string>('')

watch(
  () => props.visible,
  visible => {
    if (visible) {
      note.value = ''
    }
  },
)

function handleConfirm(): void {
  const stage = STAGES.find(item => item.name === selectedStage.value) ?? STAGES[0]
  if (!note.value.trim()) {
    ElMessage.warning('请填写进度说明')
    return
  }
  emit('confirm', stage.name, stage.percent, note.value.trim())
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40" @click="emit('close')"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-foreground">更新揭榜进度</h3>
            <p class="text-xs text-muted-foreground mt-1">进度将对发布者与围观者可见，请按实际阶段更新</p>
          </div>
          <button class="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors" @click="emit('close')">
            <IconRenderer name="x" class="w-4 h-4" />
          </button>
        </div>

        <label class="block text-sm font-medium text-foreground mb-2">当前阶段 <span class="text-red-500">*</span></label>
        <div class="space-y-2 mb-4">
          <label
            v-for="stage in STAGES"
            :key="stage.name"
            class="flex items-center gap-2.5 px-3 py-2.5 border rounded-lg cursor-pointer transition-colors"
            :class="selectedStage === stage.name ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/40'"
          >
            <input v-model="selectedStage" type="radio" :value="stage.name" class="accent-primary">
            <span class="text-sm text-foreground flex-1">{{ stage.name }}</span>
            <span class="text-xs text-muted-foreground">{{ stage.percent }}%</span>
          </label>
        </div>

        <label class="block text-sm font-medium text-foreground mb-2">进度说明 <span class="text-red-500">*</span></label>
        <textarea
          v-model="note"
          rows="3"
          placeholder="简要说明本阶段进展，例如：试点第一周掉线率降至 1.4%"
          class="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none mb-4"
        ></textarea>

        <div class="flex justify-end gap-3">
          <button class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors" @click="emit('close')">
            取消
          </button>
          <button
            :disabled="submitting"
            class="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            @click="handleConfirm"
          >
            {{ submitting ? '提交中...' : '更新进度' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
