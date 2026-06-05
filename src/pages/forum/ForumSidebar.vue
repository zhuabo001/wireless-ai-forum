<script setup lang="ts">
import type { ForumSidebarData } from '@/types/pageDesign/forum'
import HotTopicRank from './HotTopicRank.vue'
import ActiveUserList from './ActiveUserList.vue'
import HotTagCloud from './HotTagCloud.vue'
import CommunityRules from './CommunityRules.vue'

defineProps<{
  sidebarData: ForumSidebarData
}>()
</script>

<template>
  <aside class="lg:col-span-4 space-y-6">
    <div class="sticky top-24 space-y-6">
      <HotTopicRank :topics="sidebarData.hotTopics" />
      <ActiveUserList :users="sidebarData.activeUsers" />
      <HotTagCloud :tags="sidebarData.hotTags" />
      <CommunityRules :rules="sidebarData.rules" />
    </div>
  </aside>
</template>
