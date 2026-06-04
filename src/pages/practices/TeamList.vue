<script setup lang="ts">
import type { Team } from '@/types/pageDesign/practices'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  teams: Team[]
}>()
</script>

<template>
  <section class="bg-white rounded-xl border border-border p-5">
    <div class="flex items-center gap-2 mb-4">
      <IconRenderer name="building-2" class="w-4 h-4 text-primary" />
      <h2 class="text-sm font-semibold text-foreground">热门团队</h2>
    </div>
    <div class="space-y-3">
      <div
        v-for="t in teams"
        :key="t.name"
        class="flex items-center justify-between gap-3"
      >
        <div>
          <p class="text-sm font-medium text-foreground">{{ t.name }}</p>
          <p class="text-xs text-muted-foreground mt-1">{{ t.total }} 篇 · 本月新增 {{ t.monthlyNew }} 篇</p>
        </div>
        <span
          class="px-2 py-0.5 text-xs font-medium rounded-md shrink-0"
          :class="t.badgeStyle"
        >{{ t.badge }}</span>
      </div>
    </div>
  </section>
</template>
