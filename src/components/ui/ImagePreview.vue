<script setup lang="ts">
withDefaults(defineProps<{
  src: string
  alt: string
  label?: string
}>(), {
  label: '查看大图',
})

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button type="button" class="block w-full mb-8 relative group cursor-pointer text-left" @click="emit('click')">
    <img :src="src" :alt="alt" class="w-full rounded-2xl shadow-sm" />
    <span class="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-2xl transition-colors flex items-center justify-center">
      <span class="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
        {{ label }}
      </span>
    </span>
  </button>
</template>
