<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  source: string
  fallbackHtml: string
}>()

const diagramContainer = ref<HTMLElement | null>(null)
const renderFailed = ref<boolean>(false)
const loading = ref<boolean>(true)

onMounted(async () => {
  if (!diagramContainer.value) return

  try {
    const mermaid = await import('mermaid')

    mermaid.default.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'strict',
    })

    const id = `mermaid-${crypto.randomUUID()}`
    const { svg } = await mermaid.default.render(id, props.source)
    diagramContainer.value.innerHTML = svg
  } catch (error: unknown) {
    renderFailed.value = true
    console.warn('[MermaidDiagram] Render failed, falling back to code block:', error instanceof Error ? error.message : error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="mermaid-diagram">
    <div v-if="loading" class="diagram-loading">
      <span class="diagram-loading-text">图表加载中...</span>
    </div>
    <div v-else-if="renderFailed" class="diagram-fallback" v-html="fallbackHtml"></div>
    <div v-show="!loading && !renderFailed" ref="diagramContainer" class="diagram-svg-container"></div>
  </div>
</template>
