<script setup lang="ts">
import { computed } from 'vue'
import type { ChallengeDetail, ChallengeViewerRole } from '@/types/pageDesign/challengeHeroes'
import { challengeStatusMeta, resolveOptionName } from '@/utils/challenges'
import { challengeCategoryOptions, challengeDepartmentOptions } from '@/data/pageDesign/challengeHeroes'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const props = defineProps<{
  challenge: ChallengeDetail
  viewerRole: ChallengeViewerRole
}>()

const emit = defineEmits<{
  claim: []
  openScore: []
}>()

const statusMeta = computed(() => challengeStatusMeta[props.challenge.status])
const categoryName = computed(() =>
  resolveOptionName(challengeCategoryOptions, props.challenge.category),
)
const departmentName = computed(() =>
  resolveOptionName(challengeDepartmentOptions, props.challenge.department),
)
</script>

<template>
  <header class="mb-8">
    <!-- Back Navigation -->
    <div class="mb-6">
      <router-link to="/challenges" class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <IconRenderer name="arrow-left" class="w-4 h-4" />
        <span>返回难题英雄榜</span>
      </router-link>
    </div>

    <div class="flex flex-wrap items-center gap-2 mb-4">
      <span v-if="challenge.score !== null" class="px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-600 rounded-md">
        悬赏 {{ challenge.score }} 分
      </span>
      <span v-else class="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-md">评分中</span>
      <span class="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">{{ categoryName }}</span>
      <span :class="['px-2.5 py-1 text-xs font-medium rounded-md', statusMeta.badgeClass]">{{ statusMeta.label }}</span>
      <!-- 右侧操作：我要揭榜（普通用户）/ 已揭榜（揭榜人）/ 评分（超管） -->
      <div class="ml-auto flex items-center gap-2">
        <button
          v-if="viewerRole === 'visitor' && !challenge.claimant"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          @click="emit('claim')"
        >
          <IconRenderer name="swords" class="w-4 h-4" />我要揭榜
        </button>
        <span
          v-else-if="viewerRole === 'claimant'"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-lg"
        >
          <IconRenderer name="check-circle" class="w-4 h-4" />已揭榜
        </span>
        <button
          v-if="viewerRole === 'admin' && challenge.status !== 'closed'"
          class="inline-flex items-center gap-1.5 px-4 py-2 border border-border bg-white text-sm font-medium text-foreground rounded-lg hover:border-amber-400 hover:text-amber-600 transition-colors"
          @click="emit('openScore')"
        >
          <IconRenderer name="coins" class="w-4 h-4" />评分
        </button>
      </div>
    </div>

    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-6">
      {{ challenge.title }}
    </h1>

    <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div class="flex items-center gap-2.5">
        <div
          :class="['w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold flex-shrink-0', challenge.author.gradientFrom, challenge.author.gradientTo]"
        >
          {{ challenge.author.initials }}
        </div>
        <div>
          <div class="font-medium text-foreground text-sm">{{ challenge.author.name }}</div>
          <div class="text-xs">{{ departmentName }}</div>
        </div>
      </div>
      <div class="hidden sm:block w-px h-6 bg-border"></div>
      <div class="flex items-center gap-1.5">
        <IconRenderer name="calendar" class="w-3.5 h-3.5" />
        <span>{{ challenge.publishDate }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <IconRenderer name="eye" class="w-3.5 h-3.5" />
        <span>{{ challenge.viewCount.toLocaleString() }} 浏览</span>
      </div>
      <div class="flex items-center gap-1.5">
        <IconRenderer name="message-square" class="w-3.5 h-3.5" />
        <span>{{ challenge.commentCount }} 评论</span>
      </div>
    </div>

    <!-- 揭榜人信息（已有人揭榜时展示） -->
    <div v-if="challenge.claimant" class="mt-5 flex flex-wrap items-center gap-3 bg-white border border-border rounded-xl px-4 py-3">
      <span class="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 flex-shrink-0">揭榜人</span>
      <div
        :class="['w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold flex-shrink-0', challenge.claimant.user.gradientFrom, challenge.claimant.user.gradientTo]"
      >
        {{ challenge.claimant.user.initials }}
      </div>
      <div class="min-w-0">
        <p class="text-sm font-medium text-foreground">{{ challenge.claimant.user.name }}</p>
        <p class="text-xs text-muted-foreground">{{ challenge.claimant.user.department }} · {{ challenge.claimant.claimTime }}</p>
      </div>
      <div class="ml-auto text-right flex-shrink-0">
        <p class="text-xs text-muted-foreground">历史战绩</p>
        <p class="text-xs font-medium text-foreground">{{ challenge.claimant.stats }}</p>
      </div>
    </div>
  </header>
</template>
