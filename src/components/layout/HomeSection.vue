<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  id: string
  component?: Component
  className?: string
}>()
</script>

<template>
  <section :id="id" :class="className">
    <component :is="component" v-if="component" />
    <slot v-else />
  </section>
</template>
