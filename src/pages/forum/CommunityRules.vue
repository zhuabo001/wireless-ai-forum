<script setup lang="ts">
import type { ForumRule } from '@/types/pageDesign/forum'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  rules: ForumRule[]
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-border p-5">
    <h3 class="text-sm font-semibold text-foreground mb-3">社区规范</h3>
    <div class="space-y-2.5">
      <div v-for="(rule, index) in rules" :key="index" class="flex items-start gap-2.5">
        <IconRenderer name="shield-check" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
        <p class="text-xs text-muted-foreground leading-relaxed">{{ rule.content }}</p>
      </div>
    </div>
  </div>
</template>
