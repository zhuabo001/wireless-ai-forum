<script setup lang="ts">
import SectionHeader from '../components/layout/SectionHeader.vue'
import IconRenderer from '../components/ui/IconRenderer.vue'
import MediaCard from '../components/ui/MediaCard.vue'
import { courses } from '../data/home'

</script>
<template>
  <div class="section-courses py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title="热门课程" description="把公司内外的优秀课程在社区分享" />
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <MediaCard v-for="(c,i) in courses" :key="i" :image="c.cover" :title="c.title" :badge="c.tag">
          <div class="flex items-center gap-2 mb-3">
            <img :src="c.avatar" :alt="c.instructor" class="w-5 h-5 rounded-full object-cover" />
            <span class="text-xs text-muted-foreground">{{ c.instructor }} · {{ c.org }}</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-muted-foreground">
            <span class="flex items-center gap-1"><IconRenderer name="clock" class-name="w-3 h-3" />{{ c.hours }}课时</span>
            <span class="flex items-center gap-1"><IconRenderer name="star" class-name="w-3 h-3 text-amber-500" />{{ c.rating }}</span>
            <span class="flex items-center gap-1"><IconRenderer name="user" class-name="w-3 h-3" />{{ c.students }}</span>
          </div>
        </MediaCard>
      </div>
    </div>
  </div>
</template>
