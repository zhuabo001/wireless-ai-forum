<script setup lang="ts">
import type { ChallengeSidebarData } from '@/types/pageDesign/challengeHeroes'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  sidebarData: ChallengeSidebarData
}>()

const rankColors = ['text-red-500', 'text-orange-500', 'text-amber-500', 'text-gray-400', 'text-gray-400']
const scoreRankColors = ['text-amber-500', 'text-gray-400', 'text-orange-400', 'text-gray-300', 'text-gray-300']
</script>

<template>
  <aside class="lg:col-span-4 space-y-6">
    <div class="sticky top-24 space-y-6">
      <!-- 浏览榜 -->
      <div class="bg-white rounded-xl border border-border p-5">
        <h3 class="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <IconRenderer name="eye" class="w-4 h-4 text-blue-500" />浏览榜
        </h3>
        <div class="space-y-3">
          <router-link
            v-for="(entry, index) in sidebarData.viewRank"
            :key="entry.id"
            :to="`/challenges/${entry.id}`"
            class="flex items-start gap-2.5 group"
          >
            <span :class="['text-xs font-bold w-4 flex-shrink-0', rankColors[index]]">{{ index + 1 }}</span>
            <span class="flex-1 text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">{{ entry.title }}</span>
            <span class="text-xs text-muted-foreground flex-shrink-0">{{ entry.value }}</span>
          </router-link>
        </div>
      </div>

      <!-- 有用榜 -->
      <div class="bg-white rounded-xl border border-border p-5">
        <h3 class="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <IconRenderer name="thumbs-up" class="w-4 h-4 text-emerald-500" />有用榜
        </h3>
        <div class="space-y-3">
          <router-link
            v-for="(entry, index) in sidebarData.usefulRank"
            :key="entry.id"
            :to="`/challenges/${entry.id}`"
            class="flex items-start gap-2.5 group"
          >
            <span :class="['text-xs font-bold w-4 flex-shrink-0', rankColors[index]]">{{ index + 1 }}</span>
            <span class="flex-1 text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">{{ entry.title }}</span>
            <span class="text-xs text-muted-foreground flex-shrink-0">{{ entry.value }}</span>
          </router-link>
        </div>
      </div>

      <!-- 近期分数榜 -->
      <div class="bg-white rounded-xl border border-border p-5">
        <h3 class="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <IconRenderer name="trophy" class="w-4 h-4 text-amber-500" />近期分数榜
        </h3>
        <div class="space-y-3">
          <div v-for="(entry, index) in sidebarData.scoreRank" :key="entry.user.name" class="flex items-center gap-3">
            <span :class="['text-xs font-bold w-4 flex-shrink-0', scoreRankColors[index]]">{{ index + 1 }}</span>
            <div
              :class="['w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0', entry.user.gradientFrom, entry.user.gradientTo]"
            >
              {{ entry.user.initials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{{ entry.user.name }}</p>
              <p class="text-xs text-muted-foreground">{{ entry.user.department }}</p>
            </div>
            <span class="text-xs font-semibold text-amber-600 flex-shrink-0">{{ entry.scoreGain }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
