<script setup lang="ts">
import type { Contributor } from '@/types/pageDesign/practices'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  contributors: Contributor[]
}>()
</script>

<template>
  <section class="bg-white rounded-xl border border-border p-5">
    <div class="flex items-center gap-2 mb-4">
      <IconRenderer name="medal" class="w-4 h-4 text-amber-500" />
      <h2 class="text-sm font-semibold text-foreground">热门贡献者</h2>
    </div>
    <div class="space-y-3">
      <div v-for="c in contributors" :key="c.rank" class="flex items-center gap-3">
        <img :src="c.avatar" :alt="c.name" class="w-9 h-9 rounded-full object-cover" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-foreground truncate">{{ c.name }}</p>
          <p class="text-xs text-muted-foreground">{{ c.practices }} 篇实践 · {{ c.likes }} 赞</p>
        </div>
        <span
          class="text-xs font-medium"
          :class="c.rank === 1 ? 'text-amber-600' : 'text-muted-foreground'"
        >
          #{{ c.rank }}
        </span>
      </div>
    </div>
  </section>
</template>
