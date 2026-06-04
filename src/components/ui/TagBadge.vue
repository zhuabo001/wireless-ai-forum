<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  className?: string
}>(), {
  className: 'bg-primary/10 text-primary',
})
</script>

<template>
  <span :class="['text-xs font-medium px-2 py-0.5 rounded', className]">
    {{ label }}
  </span>
</template>
