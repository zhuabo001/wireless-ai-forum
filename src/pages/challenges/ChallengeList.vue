<script setup lang="ts">
import type { ChallengeItem } from '@/types/pageDesign/challengeHeroes'
import ChallengeItemView from './ChallengeItem.vue'

defineProps<{
  challenges: ChallengeItem[]
  loading: boolean
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-border overflow-hidden">
    <div v-if="loading" class="px-5 py-12 text-center text-sm text-muted-foreground">
      加载中...
    </div>
    <div v-else-if="challenges.length === 0" class="px-5 py-12 text-center text-sm text-muted-foreground">
      暂无符合条件的难题，换个筛选条件试试
    </div>
    <template v-else>
      <ChallengeItemView v-for="item in challenges" :key="item.id" :challenge="item" />
    </template>
  </div>
</template>
