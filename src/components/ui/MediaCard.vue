<script setup lang="ts">
withDefaults(defineProps<{
  image: string
  title: string
  alt?: string
  badge?: string
  imageClass?: string
  titleClass?: string
  interactive?: boolean
  scaleOnHover?: boolean
}>(), {
  alt: '',
  badge: '',
  imageClass: 'h-36',
  titleClass: 'text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2',
  interactive: true,
  scaleOnHover: true,
})
</script>

<template>
  <article
    :class="[
      'bg-white rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group',
      interactive ? 'cursor-pointer' : '',
    ]"
  >
    <div :class="[imageClass, 'overflow-hidden relative']">
      <img :src="image" :alt="alt || title" :class="['w-full h-full object-cover transition-transform duration-300', scaleOnHover ? 'group-hover:scale-105' : '']" />
      <span v-if="badge" class="absolute top-3 left-3 px-2 py-0.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-foreground rounded-md">
        {{ badge }}
      </span>
    </div>
    <div class="p-4">
      <h3 :class="titleClass">{{ title }}</h3>
      <slot />
    </div>
  </article>
</template>
