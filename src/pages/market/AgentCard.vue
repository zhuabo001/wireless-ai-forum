<script setup lang="ts">
import { ElButton } from 'element-plus'
import type { AgentItem } from '@/types/pageDesign/market'
import IconRenderer from '@/components/ui/IconRenderer.vue'
import TagBadge from '@/components/ui/TagBadge.vue'

withDefaults(defineProps<{
  agent: AgentItem
  featured?: boolean
}>(), {
  featured: false,
})
</script>

<template>
  <div
    :class="[
      'bg-white rounded-xl border border-border group',
      featured
        ? 'p-6 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
        : 'p-5 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
    ]"
  >
    <div class="flex items-start justify-between mb-3" :class="{ 'mb-4': featured }">
      <div
        class="rounded-xl flex items-center justify-center"
        :class="featured ? 'w-12 h-12' : 'w-10 h-10 rounded-lg'"
        :style="{ background: `linear-gradient(to bottom right, ${agent.gradientFrom}, ${agent.gradientTo})` }"
      >
        <IconRenderer
          :name="agent.icon"
          :class-name="featured ? 'w-6 h-6 text-white' : 'w-5 h-5 text-white'"
        />
      </div>
      <TagBadge :label="agent.type" :class-name="agent.typeStyle" />
    </div>
    <h3
      :class="[
        'font-semibold text-foreground mb-1 group-hover:text-primary transition-colors',
        featured ? 'text-lg mb-2' : 'text-base',
      ]"
    >
      {{ agent.name }}
    </h3>
    <p class="text-sm text-muted-foreground mb-4">
      <span v-if="featured">{{ agent.desc }}</span>
      <span v-else>{{ agent.desc }}</span>
    </p>
    <div class="flex items-center gap-4 text-xs text-muted-foreground" :class="{ 'mb-4': !featured }">
      <span class="flex items-center gap-1">
        <IconRenderer name="download" class-name="w-3.5 h-3.5" />
        {{ agent.downloads }}
      </span>
      <span class="flex items-center gap-1">
        <IconRenderer name="star" class-name="w-3.5 h-3.5 text-amber-500" />
        {{ agent.rating }}
      </span>
    </div>
    <div v-if="!featured" class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="w-5 h-5 rounded-full"
          :style="{ background: `linear-gradient(to bottom right, ${agent.gradientFrom}, ${agent.gradientTo})` }"
        />
        <span class="text-xs text-muted-foreground">{{ agent.developer }}</span>
      </div>
      <ElButton size="small" type="primary" class="market-filter-button">安装</ElButton>
    </div>
  </div>
</template>
