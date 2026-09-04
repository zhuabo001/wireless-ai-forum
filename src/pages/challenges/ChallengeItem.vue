<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ChallengeItem } from '@/types/pageDesign/challengeHeroes'
import { challengeStatusMeta, resolveOptionName } from '@/utils/challenges'
import { challengeCategoryOptions } from '@/data/pageDesign/challengeHeroes'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const props = defineProps<{
  challenge: ChallengeItem
}>()

const router = useRouter()

const statusMeta = computed(() => challengeStatusMeta[props.challenge.status])
const categoryName = computed(() =>
  resolveOptionName(challengeCategoryOptions, props.challenge.category),
)
const viewCountText = computed(() =>
  props.challenge.viewCount >= 1000
    ? `${(props.challenge.viewCount / 1000).toFixed(1)}k`
    : String(props.challenge.viewCount),
)

function goToDetail(): void {
  router.push(`/challenges/${props.challenge.id}`)
}
</script>

<template>
  <div class="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-border/50 last:border-b-0" @click="goToDetail">
    <div
      :class="['w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold flex-shrink-0', challenge.author.gradientFrom, challenge.author.gradientTo]"
    >
      {{ challenge.author.initials }}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1 flex-wrap">
        <span v-if="challenge.score !== null" class="text-xs font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">
          悬赏 {{ challenge.score }} 分
        </span>
        <span v-else class="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
          评分中
        </span>
        <span :class="['text-xs font-medium px-1.5 py-0.5 rounded', statusMeta.badgeClass]">
          {{ statusMeta.label }}
        </span>
        <span class="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
          {{ categoryName }}
        </span>
        <span class="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
          {{ challenge.title }}
        </span>
      </div>
      <span class="text-xs text-muted-foreground">
        {{ challenge.author.name }} · {{ challenge.author.department }} · {{ challenge.publishTime }}<template v-if="challenge.claimedBy"> · 已被 {{ challenge.claimedBy }} 揭榜</template>
      </span>
    </div>
    <div class="hidden sm:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
      <span class="flex items-center gap-1">
        <IconRenderer name="swords" class="w-3.5 h-3.5" />{{ challenge.claimCount }}
      </span>
      <span class="flex items-center gap-1">
        <IconRenderer name="eye" class="w-3.5 h-3.5" />{{ viewCountText }}
      </span>
      <span class="flex items-center gap-1">
        <IconRenderer name="thumbs-up" class="w-3.5 h-3.5" />{{ challenge.likeCount }}
      </span>
    </div>
  </div>
</template>
