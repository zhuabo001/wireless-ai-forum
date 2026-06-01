<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
        @keydown.escape="close"
        tabindex="0"
        ref="overlayRef"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <!-- Content -->
        <div
          class="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden"
        >
          <button
            class="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            @click="close"
          >
            <X class="w-4 h-4" />
          </button>
          <img
            :src="src"
            :alt="alt"
            class="w-full h-full object-contain"
            style="max-height: 85vh;"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  open: boolean
  src: string
  alt?: string
}>(), {
  alt: ''
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const overlayRef = ref<HTMLElement | null>(null)

function close() {
  emit('update:open', false)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    close()
  }
}

// Focus the overlay div when opened so it can receive keyboard events
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    // focus after next tick so the element is rendered
    setTimeout(() => overlayRef.value?.focus(), 0)
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>
