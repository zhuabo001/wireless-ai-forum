<script setup lang="ts">
import type { ChallengeTimelineEntry } from '@/types/pageDesign/challengeHeroes'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  progressPercent: number
  timeline: ChallengeTimelineEntry[]
}>()

const dotClass: Record<ChallengeTimelineEntry['type'], string> = {
  done: 'bg-emerald-500',
  current: 'bg-primary timeline-current-dot',
  pending: 'bg-gray-300',
}

const titleClass: Record<ChallengeTimelineEntry['type'], string> = {
  done: 'text-foreground',
  current: 'text-primary font-semibold',
  pending: 'text-muted-foreground',
}
</script>

<template>
  <div class="bg-white rounded-xl border border-border p-5">
    <h3 class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
      <IconRenderer name="flag" class="w-4 h-4 text-primary" />揭榜进度
    </h3>
    <div class="flex items-center justify-between text-xs mb-1.5">
      <span class="font-medium text-foreground">解决进度</span>
      <span class="font-semibold text-primary">{{ progressPercent }}%</span>
    </div>
    <div class="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-5">
      <div class="h-full bg-primary rounded-full transition-all duration-500" :style="{ width: progressPercent + '%' }"></div>
    </div>
    <ol>
      <li v-for="(entry, index) in timeline" :key="entry.id" :class="['relative pl-6', index === timeline.length - 1 ? '' : 'pb-5']">
        <span :class="['absolute left-0 top-1 w-2.5 h-2.5 rounded-full', dotClass[entry.type]]"></span>
        <span v-if="index !== timeline.length - 1" class="absolute left-[4.5px] top-4 bottom-0 w-px bg-border"></span>
        <p :class="['text-xs font-medium', titleClass[entry.type]]">{{ entry.title }}</p>
        <p class="text-[11px] text-muted-foreground mt-0.5">{{ entry.time }}</p>
        <p v-if="entry.note" class="text-[11px] text-muted-foreground leading-relaxed mt-1 bg-muted/60 rounded-md px-2 py-1.5">{{ entry.note }}</p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.timeline-current-dot {
  animation: node-pulse 1.8s ease-out infinite;
}
@keyframes node-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(13, 85, 201, 0.35); }
  50% { box-shadow: 0 0 0 5px rgba(13, 85, 201, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .timeline-current-dot { animation: none; }
}
</style>
