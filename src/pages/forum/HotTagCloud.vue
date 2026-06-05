<script setup lang="ts">
import type { HotTag } from '@/types/pageDesign/forum'

defineProps<{
  tags: HotTag[]
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-border p-5">
    <h3 class="text-sm font-semibold text-foreground mb-4">热门标签</h3>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in tags"
        :key="tag.name"
        :class="['px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer hover:opacity-80 transition-colors', tag.bgClass, tag.textClass]"
      >
        {{ tag.name }}
      </span>
    </div>
  </div>
</template>
