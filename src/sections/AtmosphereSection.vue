<script setup lang="ts">
import SectionHeader from '../components/layout/SectionHeader.vue'
import IconRenderer from '../components/ui/IconRenderer.vue'
import MediaCard from '../components/ui/MediaCard.vue'
import { atmosphereEvents as events } from '../data/home'

</script>
<template>
  <div class="section-atmosphere py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title="氛围建设" description="AI相关的线下研讨、圆桌讨论、荣誉颁奖" />
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <MediaCard
          v-for="e in events"
          :key="e.title"
          :image="e.image"
          :title="e.title"
          image-class="h-40"
          title-class="text-base font-semibold text-foreground mb-2"
          :interactive="false"
          :scale-on-hover="false"
        >
          <div class="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
            <span class="flex items-center gap-1"><IconRenderer name="calendar" class-name="w-3 h-3" />{{ e.date }}</span>
            <span class="flex items-center gap-1"><IconRenderer name="map-pin" class-name="w-3 h-3" />{{ e.location }}</span>
            <span class="flex items-center gap-1"><IconRenderer name="users" class-name="w-3 h-3" />{{ e.participants }}人参与</span>
          </div>
          <p class="text-sm text-muted-foreground">{{ e.desc }}</p>
        </MediaCard>
      </div>
    </div>
  </div>
</template>
