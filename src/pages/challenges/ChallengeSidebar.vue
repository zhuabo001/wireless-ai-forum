<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChallengeScoreRankEntry, ChallengeSidebarData } from '@/types/pageDesign/challengeHeroes'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const props = defineProps<{
  sidebarData: ChallengeSidebarData
}>()

/** 分数榜当前展示面板：recent 近期 / total 总榜 */
const scoreTab = ref<'recent' | 'total'>('recent')
const activeScoreRank = computed<ChallengeScoreRankEntry[]>(() =>
  scoreTab.value === 'recent' ? props.sidebarData.scoreRank : props.sidebarData.totalScoreRank,
)

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

      <!-- 分数榜（近期 / 总榜切换） -->
      <div class="bg-white rounded-xl border border-border p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
            <IconRenderer name="trophy" class="w-4 h-4 text-amber-500" />分数榜
          </h3>
          <div class="flex bg-muted rounded-lg p-0.5">
            <button
              :class="[
                'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                scoreTab === 'recent' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="scoreTab = 'recent'"
            >
              近期
            </button>
            <button
              :class="[
                'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                scoreTab === 'total' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="scoreTab = 'total'"
            >
              总榜
            </button>
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="(entry, index) in activeScoreRank" :key="entry.user.name" class="flex items-center gap-3">
            <span :class="['text-xs font-bold w-4 flex-shrink-0', scoreRankColors[index]]">{{ index + 1 }}</span>
            <div
              :class="['w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0', entry.user.gradientFrom, entry.user.gradientTo]"
            >
              {{ entry.user.initials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{{ entry.user.name }}</p>
              <p class="text-xs text-muted-foreground">{{ entry.subText ?? entry.user.department }}</p>
            </div>
            <span class="text-xs font-semibold text-amber-600 flex-shrink-0">{{ entry.scoreGain }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
