<script setup lang="ts">
import { defineAsyncComponent, type Component } from 'vue'
import HomeLayout from '@/components/layout/HomeLayout.vue'
import HomeSection from '@/components/layout/HomeSection.vue'
// 首屏区块静态导入，保证 LCP 不依赖额外网络往返
import HeroSection from '@/sections/HeroSection.vue'
import { homeSections } from '@/data/home'

// 首屏以下区块异步化：配合 HomeSection 的可见性门控，其 chunk（含 Element Plus
// 等依赖）在区块滚入视口附近才加载，不进入首页关键路径
const sectionComponents: Record<string, Component> = {
  HeroSection,
  EngineeringSection: defineAsyncComponent(() => import('@/sections/EngineeringSection.vue')),
  PracticesSection: defineAsyncComponent(() => import('@/sections/PracticesSection.vue')),
  ToolboxSection: defineAsyncComponent(() => import('@/sections/ToolboxSection.vue')),
  IntelligenceSection: defineAsyncComponent(() => import('@/sections/IntelligenceSection.vue')),
  CoursesSection: defineAsyncComponent(() => import('@/sections/CoursesSection.vue')),
  AtmosphereSection: defineAsyncComponent(() => import('@/sections/AtmosphereSection.vue')),
  ForumSection: defineAsyncComponent(() => import('@/sections/ForumSection.vue')),
  AgentMarketSection: defineAsyncComponent(() => import('@/sections/AgentMarketSection.vue')),
  RoadMapSection: defineAsyncComponent(() => import('@/sections/RoadMapSection.vue')),
}
</script>

<template>
  <HomeLayout>
    <HomeSection
      v-for="section in homeSections"
      :key="section.id"
      :id="section.id"
      :class-name="section.className"
      :min-height="section.minHeight"
      :component="sectionComponents[section.component]"
    />
  </HomeLayout>
</template>
