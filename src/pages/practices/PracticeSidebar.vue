<script setup lang="ts">
import type { HotPost, Contributor, Team } from '@/types/pageDesign/practices'
import HotPostList from './HotPostList.vue'
import ContributorList from './ContributorList.vue'
import TeamList from './TeamList.vue'

defineProps<{
  hotPosts: HotPost[]
  contributors: Contributor[]
  teams: Team[]
}>()
</script>

<template>
  <aside class="lg:col-span-3">
    <div class="sticky top-24 space-y-6">
      <HotPostList :posts="hotPosts" />
      <ContributorList :contributors="contributors" />
      <TeamList :teams="teams" />
    </div>
  </aside>
</template>
