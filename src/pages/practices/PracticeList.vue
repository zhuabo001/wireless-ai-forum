<script setup lang="ts">
import type { PracticeItem } from '@/types/pageDesign/practices'
import PracticeCard from './PracticeCard.vue'

defineProps<{
  items: PracticeItem[]
}>()
</script>

<template>
  <div class="space-y-4">
    <PracticeCard v-for="item in items" :key="item.id" :practice="item" />
  </div>
</template>
