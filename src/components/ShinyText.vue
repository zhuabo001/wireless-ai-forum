<template>
  <span
    :class="['inline-block', props.className]"
    :style="shinyStyle"
  >
    {{ props.text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ShinyTextProps {
  text: string
  className?: string
  speed?: number
  baseColor?: string
  shineColor?: string
  spread?: number
}

const props = withDefaults(defineProps<ShinyTextProps>(), {
  className: '',
  speed: 3,
  baseColor: '#0f172a',
  shineColor: '#3b82f6',
  spread: 120,
})

const shinyStyle = computed(() => ({
  backgroundImage: `linear-gradient(${props.spread}deg, ${props.baseColor} 0%, ${props.baseColor} 40%, ${props.shineColor} 50%, ${props.baseColor} 60%, ${props.baseColor} 100%)`,
  backgroundSize: '250% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `shine-sweep ${props.speed}s linear infinite`,
}))
</script>

<style>
@keyframes shine-sweep {
  0% {
    background-position: 250% center;
  }
  100% {
    background-position: -250% center;
  }
}
</style>
