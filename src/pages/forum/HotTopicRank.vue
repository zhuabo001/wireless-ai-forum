<script setup lang="ts">
import type { HotTopic } from '@/types/pageDesign/forum'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  topics: HotTopic[]
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-border p-5">
    <h3 class="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
      <IconRenderer name="flame" class="w-4 h-4 text-red-500" />
      热帖排行
    </h3>
    <div class="space-y-3">
      <a
        v-for="topic in topics"
        :key="topic.rank"
        href="#"
        class="flex items-start gap-2.5 group"
      >
        <span :class="['text-xs font-bold w-4 flex-shrink-0', topic.rankColor]">
          {{ topic.rank }}
        </span>
        <IconRenderer name="flame" :class="['w-3.5 h-3.5 mt-0.5 flex-shrink-0', topic.flameColor]" />
        <span class="text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
          {{ topic.title }}
        </span>
      </a>
    </div>
  </div>
</template>
