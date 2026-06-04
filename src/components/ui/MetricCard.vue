<script setup lang="ts">
import IconRenderer from './IconRenderer.vue'
import type { IconName } from '../../types/home'

withDefaults(defineProps<{
  icon: IconName | string
  label: string
  value: string
  layout?: 'center' | 'inline'
  className?: string
}>(), {
  layout: 'center',
  className: '',
})
</script>

<template>
  <div
    :class="[
      layout === 'center'
        ? 'flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all'
        : 'flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200',
      className,
    ]"
  >
    <div v-if="layout === 'inline'" class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
      <IconRenderer :name="icon" class-name="w-5 h-5 text-primary" />
    </div>
    <IconRenderer v-else :name="icon" class-name="w-5 h-5 text-primary mb-2" />
    <div :class="layout === 'center' ? 'contents' : ''">
      <span :class="[layout === 'center' ? 'text-2xl' : 'block text-xl', 'font-bold text-foreground']">{{ value }}</span>
      <span :class="[layout === 'center' ? 'mt-0.5' : '', 'text-xs text-muted-foreground']">{{ label }}</span>
    </div>
  </div>
</template>
