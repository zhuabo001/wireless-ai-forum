<script setup lang="ts">
import type { DownloadRankItem, NewDeveloperItem } from '@/types/pageDesign/market'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  downloadRank: DownloadRankItem[]
  newDevelopers: NewDeveloperItem[]
  usageGuide: {
    description: string
    linkText: string
    linkHref: string
  }
}>()

function rankBadgeClass(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-amber-500'
    case 2:
      return 'bg-gray-400'
    case 3:
      return 'bg-orange-400'
    default:
      return 'bg-muted'
  }
}

function rankTextClass(rank: number): string {
  return rank <= 3 ? 'text-xs font-bold text-white' : 'text-xs font-medium text-muted-foreground'
}
</script>

<template>
  <aside class="lg:col-span-3 space-y-6">
    <div class="sticky top-24 space-y-6">
      <!-- Download Ranking -->
      <div class="bg-white rounded-xl border border-border p-5">
        <h3 class="text-sm font-semibold text-foreground mb-4">下载排行</h3>
        <div class="space-y-3">
          <div v-for="item in downloadRank" :key="item.rank" class="flex items-center gap-3">
            <span
              :class="['w-5 h-5 flex items-center justify-center rounded', rankBadgeClass(item.rank), rankTextClass(item.rank)]"
            >
              {{ item.rank }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{{ item.name }}</p>
              <p class="text-xs text-muted-foreground">{{ item.downloads }} 下载</p>
            </div>
          </div>
        </div>
      </div>

      <!-- New Developers -->
      <div class="bg-white rounded-xl border border-border p-5">
        <h3 class="text-sm font-semibold text-foreground mb-4">新晋开发者</h3>
        <div class="space-y-3">
          <div v-for="dev in newDevelopers" :key="dev.fullName" class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              :style="{ background: `linear-gradient(to bottom right, ${dev.gradientFrom}, ${dev.gradientTo})` }"
            >
              {{ dev.surname }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{{ dev.fullName }}</p>
              <p class="text-xs text-muted-foreground">{{ dev.contribution }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Usage Guide -->
      <div class="bg-white rounded-xl border border-border p-5">
        <h3 class="text-sm font-semibold text-foreground mb-3">使用指南</h3>
        <p class="text-xs text-muted-foreground mb-4 leading-relaxed">{{ usageGuide.description }}</p>
        <a
          :href="usageGuide.linkHref"
          class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {{ usageGuide.linkText }} <IconRenderer name="arrow-right" class-name="w-3 h-3" />
        </a>
      </div>
    </div>
  </aside>
</template>
