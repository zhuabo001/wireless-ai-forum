<script setup lang="ts">
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  keyword: string
  placeholder: string
}>()

const emit = defineEmits<{
  'update:keyword': [value: string]
}>()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:keyword', target.value)
}
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="relative flex-1">
      <IconRenderer
        name="search"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
      />
      <input
        type="text"
        :value="keyword"
        :placeholder="placeholder"
        class="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
        @input="onInput"
      />
    </div>
  </div>
</template>
