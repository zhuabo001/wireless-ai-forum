<script setup lang="ts">
import type { Component } from 'vue'
import HomeLayout from '@/components/layout/HomeLayout.vue'
import HomeSection from '@/components/layout/HomeSection.vue'
import HeroSection from '@/sections/HeroSection.vue'
import EngineeringSection from '@/sections/EngineeringSection.vue'
import PracticesSection from '@/sections/PracticesSection.vue'
import ToolboxSection from '@/sections/ToolboxSection.vue'
import IntelligenceSection from '@/sections/IntelligenceSection.vue'
import CoursesSection from '@/sections/CoursesSection.vue'
import AtmosphereSection from '@/sections/AtmosphereSection.vue'
import ForumSection from '@/sections/ForumSection.vue'
import AgentMarketSection from '@/sections/AgentMarketSection.vue'
import RoadMapSection from '@/sections/RoadMapSection.vue'
import { homeSections } from '@/data/home'

const sectionComponents: Record<string, Component> = {
  HeroSection,
  EngineeringSection,
  PracticesSection,
  ToolboxSection,
  IntelligenceSection,
  CoursesSection,
  AtmosphereSection,
  ForumSection,
  AgentMarketSection,
  RoadMapSection,
}
</script>

<template>
  <HomeLayout>
    <HomeSection
      v-for="section in homeSections"
      :key="section.id"
      :id="section.id"
      :class-name="section.className"
      :component="sectionComponents[section.component]"
    />
  </HomeLayout>
</template>
