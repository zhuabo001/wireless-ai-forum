<script setup lang="ts">
import SectionHeader from '../components/layout/SectionHeader.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import IconRenderer from '../components/ui/IconRenderer.vue'
import TagBadge from '../components/ui/TagBadge.vue'
import { practices } from '../data/home'

</script>
<template>
  <div class="section-practices py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title="优秀实践" description="各部门AI辅助作业的优秀实践分享" />
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <BaseCard v-for="p in practices" :key="p.title" interactive>
          <div class="flex items-center gap-2 mb-3"><TagBadge :label="p.dept" class-name="bg-primary/10 text-primary px-2 py-1 rounded-md" /></div>
          <h3 class="text-base font-semibold text-foreground mb-2 flex items-center gap-2"><IconRenderer name="zap" class-name="w-4 h-4 text-amber-500" /> {{ p.title }}</h3>
          <p class="text-sm text-muted-foreground mb-3">{{ p.desc }}</p>
          <div class="flex flex-wrap gap-1.5"><TagBadge v-for="tag in p.tags" :key="tag" :label="tag" class-name="bg-gray-100 text-gray-600 rounded-full" /></div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
