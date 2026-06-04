<script setup lang="ts">
import BeamsBackground from '../BeamsBackground.vue'
import QuickNavDock from '../QuickNavDock.vue'
import Footer from '../../sections/Footer.vue'
</script>

<template>
  <div class="min-h-screen relative">
    <div class="fixed inset-0 z-0 pointer-events-none">
      <BeamsBackground />
    </div>

    <QuickNavDock />

    <main class="relative z-10">
      <slot />
      <Footer />
    </main>
  </div>
</template>
