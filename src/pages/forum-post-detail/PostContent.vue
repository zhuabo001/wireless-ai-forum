<script setup lang="ts">
import type { ContentBlock } from '@/types/pageDesign/forumPostDetail'
import DiagramBlock from './DiagramBlock.vue'
import TableBlock from './TableBlock.vue'

defineProps<{
  blocks: ContentBlock[]
}>()
</script>

<template>
  <article class="article-body text-base sm:text-[0.9375rem] mb-16">
    <template v-for="(block, index) in blocks" :key="index">
      <h2 v-if="block.type === 'heading' && block.level !== 3" v-html="block.html"></h2>
      <h3 v-else-if="block.type === 'heading' && block.level === 3" v-html="block.html"></h3>
      <ol v-else-if="block.type === 'list' && block.ordered" v-html="block.html"></ol>
      <ul v-else-if="block.type === 'list' && !block.ordered" v-html="block.html"></ul>
      <pre v-else-if="block.type === 'code'"><code v-html="block.html"></code></pre>
      <blockquote v-else-if="block.type === 'blockquote'" v-html="block.html"></blockquote>
      <TableBlock
        v-else-if="block.type === 'table'"
        :html="block.html"
      />
      <DiagramBlock
        v-else-if="block.type === 'diagram' && block.engine && block.source"
        :engine="block.engine"
        :source="block.source"
        :fallback-html="block.html"
      />
      <p v-else v-html="block.html"></p>
    </template>
  </article>
</template>

<style>
.article-body { line-height: 1.8; color: #334155; }
.article-body h2 { font-size: 1.375rem; font-weight: 700; color: #0f172a; margin-top: 2.5rem; margin-bottom: 1rem; line-height: 1.35; }
.article-body h3 { font-size: 1.125rem; font-weight: 600; color: #0f172a; margin-top: 2rem; margin-bottom: 0.75rem; }
.article-body p { margin-bottom: 1.25rem; }
.article-body ul { list-style: disc; padding-left: 1.75rem; margin-bottom: 1.25rem; }
.article-body ol { list-style: decimal; padding-left: 1.75rem; margin-bottom: 1.25rem; }
.article-body li { margin-bottom: 0.375rem; }
.article-body blockquote { border-left: 3px solid #cbd5e1; padding-left: 1.25rem; color: #475569; margin: 1.5rem 0; font-style: italic; }
.article-body pre { background: #f1f5f9; padding: 1rem 1.25rem; border-radius: 0.625rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875rem; overflow-x: auto; line-height: 1.65; margin: 1.25rem 0; }
.article-body code { background: #f1f5f9; padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875em; color: #0f172a; }
.article-body pre code { background: none; padding: 0; }
.article-body img { max-width: 100%; border-radius: 0.625rem; margin: 1.5rem 0; }
.article-body a { color: #0d55c9; text-decoration: none; }
.article-body a:hover { text-decoration: underline; }
.article-body .diagram-block { margin: 1.5rem 0; }
.article-body .diagram-svg-container { display: flex; justify-content: center; overflow-x: auto; }
.article-body .diagram-svg-container svg { max-width: 100%; height: auto; }
.article-body .diagram-loading { display: flex; justify-content: center; align-items: center; padding: 2rem 1.25rem; background: #f8fafc; border-radius: 0.625rem; border: 1px dashed #cbd5e1; }
.article-body .diagram-loading-text { color: #94a3b8; font-size: 0.875rem; }
.article-body .diagram-fallback pre { background: #f1f5f9; padding: 1rem 1.25rem; border-radius: 0.625rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875rem; overflow-x: auto; line-height: 1.65; }
.article-body .diagram-fallback code { background: none; padding: 0; }
</style>
