<template>
  <span :class="computedClasses" :style="inlineStyles" :data-text="text">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

interface GlitchTextProps {
  text: string
  speed?: number
  enableShadows?: boolean
  enableOnHover?: boolean
  className?: string
}

interface CustomCSSProperties extends CSSProperties {
  '--after-duration': string
  '--before-duration': string
  '--after-shadow': string
  '--before-shadow': string
}

const props = withDefaults(defineProps<GlitchTextProps>(), {
  speed: 0.5,
  enableShadows: true,
  enableOnHover: false,
  className: ''
})

const inlineStyles = computed(
  (): CustomCSSProperties => ({
    '--after-duration': `${props.speed * 3}s`,
    '--before-duration': `${props.speed * 2}s`,
    '--after-shadow': props.enableShadows ? '-4px 0 #0d55c9' : 'none',
    '--before-shadow': props.enableShadows ? '4px 0 #6366f1' : 'none'
  })
)

const baseClasses = [
  'relative',
  'inline-block',
  'whitespace-nowrap',
  'select-none',

  'before:content-[attr(data-text)]',
  'before:absolute',
  'before:top-0',
  'before:left-0',
  'before:w-full',
  'before:h-full',
  'before:text-foreground',
  'before:bg-[#f8fafc]',
  'before:overflow-hidden',

  'after:content-[attr(data-text)]',
  'after:absolute',
  'after:top-0',
  'after:left-0',
  'after:w-full',
  'after:h-full',
  'after:text-foreground',
  'after:bg-[#f8fafc]',
  'after:overflow-hidden'
]

const normalGlitchClasses = [
  'after:left-[3px]',
  'after:[text-shadow:var(--after-shadow)]',
  'after:[animation:glitch-anim_var(--after-duration)_infinite_linear_alternate-reverse]',

  'before:left-[-3px]',
  'before:[text-shadow:var(--before-shadow)]',
  'before:[animation:glitch-anim_var(--before-duration)_infinite_linear_alternate-reverse]'
]

const hoverOnlyClasses = [
  'before:content-[""]',
  'before:opacity-0',
  'before:[animation:none]',
  'after:content-[""]',
  'after:opacity-0',
  'after:[animation:none]',

  'hover:before:content-[attr(data-text)]',
  'hover:before:opacity-100',
  'hover:before:left-[-3px]',
  'hover:before:[text-shadow:var(--before-shadow)]',
  'hover:before:[animation:glitch-anim_var(--before-duration)_infinite_linear_alternate-reverse]',

  'hover:after:content-[attr(data-text)]',
  'hover:after:opacity-100',
  'hover:after:left-[3px]',
  'hover:after:[text-shadow:var(--after-shadow)]',
  'hover:after:[animation:glitch-anim_var(--after-duration)_infinite_linear_alternate-reverse]'
]

const computedClasses = computed(() => {
  const classes = [...baseClasses]

  if (props.enableOnHover) {
    classes.push(...hoverOnlyClasses)
  } else {
    classes.push(...normalGlitchClasses)
  }

  if (props.className) {
    classes.push(props.className)
  }

  return classes.join(' ')
})
</script>

<style>
@keyframes glitch-anim {
  0% {
    clip-path: inset(20% 0 50% 0);
  }
  5% {
    clip-path: inset(10% 0 60% 0);
  }
  10% {
    clip-path: inset(15% 0 55% 0);
  }
  15% {
    clip-path: inset(25% 0 35% 0);
  }
  20% {
    clip-path: inset(30% 0 40% 0);
  }
  25% {
    clip-path: inset(40% 0 20% 0);
  }
  30% {
    clip-path: inset(10% 0 60% 0);
  }
  35% {
    clip-path: inset(15% 0 55% 0);
  }
  40% {
    clip-path: inset(25% 0 35% 0);
  }
  45% {
    clip-path: inset(30% 0 40% 0);
  }
  50% {
    clip-path: inset(20% 0 50% 0);
  }
  55% {
    clip-path: inset(10% 0 60% 0);
  }
  60% {
    clip-path: inset(15% 0 55% 0);
  }
  65% {
    clip-path: inset(25% 0 35% 0);
  }
  70% {
    clip-path: inset(30% 0 40% 0);
  }
  75% {
    clip-path: inset(40% 0 20% 0);
  }
  80% {
    clip-path: inset(20% 0 50% 0);
  }
  85% {
    clip-path: inset(10% 0 60% 0);
  }
  90% {
    clip-path: inset(15% 0 55% 0);
  }
  95% {
    clip-path: inset(25% 0 35% 0);
  }
  100% {
    clip-path: inset(30% 0 40% 0);
  }
}
</style>
