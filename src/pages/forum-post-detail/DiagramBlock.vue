<script setup lang="ts">
import type { DiagramEngine } from '@/types/pageDesign/forumPostDetail'
import MermaidDiagram from './MermaidDiagram.vue'

defineProps<{
  engine: DiagramEngine
  source: string
  fallbackHtml: string
}>()
</script>

<template>
  <div class="diagram-block">
    <MermaidDiagram
      v-if="engine === 'mermaid'"
      :source="source"
      :fallback-html="fallbackHtml"
    />
    <!-- plantuml deferred: KrokiDiagram will be added here in a future iteration -->
    <div
      v-else
      class="diagram-fallback"
      v-html="fallbackHtml"
    ></div>
  </div>
</template>
