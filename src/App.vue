<script setup lang="ts">
import BeamsBackground from './components/BeamsBackground.vue'
import Navbar from './components/Navbar.vue'
import QuickNavDock from './components/QuickNavDock.vue'
import HeroSection from './sections/HeroSection.vue'
import EngineeringSection from './sections/EngineeringSection.vue'
import PracticesSection from './sections/PracticesSection.vue'
import ToolboxSection from './sections/ToolboxSection.vue'
import IntelligenceSection from './sections/IntelligenceSection.vue'
import CoursesSection from './sections/CoursesSection.vue'
import AtmosphereSection from './sections/AtmosphereSection.vue'
import ForumSection from './sections/ForumSection.vue'
import AgentMarketSection from './sections/AgentMarketSection.vue'
import Footer from './sections/Footer.vue'
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Global beams background -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <BeamsBackground />
    </div>

    <Navbar />
    <QuickNavDock />

    <main class="relative z-10">
      <section id="hero" class="py-16">
        <HeroSection />
      </section>
      <section id="engineering" class="py-16">
        <EngineeringSection />
      </section>
      <section id="practices" class="py-16">
        <PracticesSection />
      </section>
      <section id="toolbox" class="py-16">
        <ToolboxSection />
      </section>
      <section id="intelligence" class="py-16">
        <IntelligenceSection />
      </section>
      <section id="courses" class="py-16">
        <CoursesSection />
      </section>
      <section id="atmosphere" class="py-16">
        <AtmosphereSection />
      </section>
      <section id="forum" class="py-16">
        <ForumSection />
      </section>
      <section id="market" class="py-16">
        <AgentMarketSection />
      </section>
      <Footer />
    </main>
  </div>
</template>
