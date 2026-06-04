<script setup lang="ts">
withDefaults(defineProps<{
  as?: string
  interactive?: boolean
  padded?: boolean
  className?: string
}>(), {
  as: 'div',
  interactive: false,
  padded: true,
  className: '',
})
</script>

<template>
  <component
    :is="as"
    :class="[
      'bg-white rounded-xl border border-gray-200 transition-all',
      padded ? 'p-5' : '',
      interactive ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : '',
      className,
    ]"
  >
    <slot />
  </component>
</template>
