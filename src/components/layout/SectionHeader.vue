<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  align?: 'center' | 'left'
  className?: string
}>(), {
  align: 'center',
  description: '',
  className: '',
})
</script>

<template>
  <div :class="[align === 'center' ? 'text-center' : '', className || 'mb-10']">
    <h2 :class="['text-3xl font-bold text-foreground', align === 'center' ? 'mb-3' : 'mb-1']">{{ title }}</h2>
    <p v-if="description" :class="['text-muted-foreground', align === 'center' ? 'max-w-xl mx-auto' : 'text-sm']">
      {{ description }}
    </p>
  </div>
</template>
