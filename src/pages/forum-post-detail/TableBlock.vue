<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  html: string
}>()

const tableContainer = ref<HTMLElement | null>(null)

function scrollHorizontally(distance: number): void {
  if (!tableContainer.value) return
  tableContainer.value.scrollLeft += distance
}
</script>

<template>
  <div
    ref="tableContainer"
    class="table-block"
    role="region"
    aria-label="可横向滚动的文章表格"
    tabindex="0"
    @keydown.left.prevent="scrollHorizontally(-48)"
    @keydown.right.prevent="scrollHorizontally(48)"
  >
    <table class="content-table" v-html="html"></table>
  </div>
</template>

<style scoped>
.table-block {
  width: 100%;
  max-width: 100%;
  margin: 1.25rem 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  -webkit-overflow-scrolling: touch;
}

.table-block:focus-visible {
  outline: 2px solid #0d55c9;
  outline-offset: 4px;
}

.content-table {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.content-table :deep(th),
.content-table :deep(td) {
  min-inline-size: 8rem;
  padding: 0.625rem 1rem;
  border: 1px solid #e2e8f0;
  text-align: left;
  vertical-align: top;
  white-space: nowrap;
}

.content-table :deep(th) {
  background: #f8fafc;
  color: #0f172a;
  font-weight: 600;
}
</style>
