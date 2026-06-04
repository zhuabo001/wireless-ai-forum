<script setup lang="ts">
import SectionHeader from '../components/layout/SectionHeader.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import IconRenderer from '../components/ui/IconRenderer.vue'
import { tools as toolData } from '../data/home'

</script>
<template>
  <div class="section-toolbox py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title="Agent百宝箱" description="工具和工程能力的用户指导和手册" />
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <BaseCard v-for="tool in toolData" :key="tool.title" interactive class-name="flex flex-col items-center">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><IconRenderer :name="tool.icon" class-name="w-5 h-5 text-primary" /></div>
          <span class="text-sm font-semibold text-foreground">{{ tool.title }}</span>
          <span class="text-xs text-muted-foreground mt-1 text-center">{{ tool.desc }}</span>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
