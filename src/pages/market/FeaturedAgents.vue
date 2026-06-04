<script setup lang="ts">
import type { AgentItem } from '@/types/pageDesign/market'
import IconRenderer from '@/components/ui/IconRenderer.vue'
import AgentCard from './AgentCard.vue'

defineProps<{
  agents: AgentItem[]
}>()
</script>

<template>
  <div class="mb-8">
    <div class="flex items-center gap-2 mb-4">
      <IconRenderer name="sparkles" class-name="w-4 h-4 text-amber-500" />
      <h2 class="text-sm font-semibold text-foreground">本周精选</h2>
    </div>
    <div class="grid sm:grid-cols-3 gap-4">
      <AgentCard v-for="agent in agents" :key="agent.name" :agent="agent" featured />
    </div>
  </div>
</template>
