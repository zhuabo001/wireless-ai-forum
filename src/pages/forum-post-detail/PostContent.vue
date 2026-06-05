<script setup lang="ts">
import type { ContentBlock, ContentBlockType } from '@/types/pageDesign/forumPostDetail'

defineProps<{
  blocks: ContentBlock[]
}>()

function blockTag(type: ContentBlockType, level?: number): string {
  switch (type) {
    case 'heading':
      return level === 3 ? 'h3' : 'h2'
    case 'list':
      return 'ul'
    case 'code':
      return 'pre'
    case 'blockquote':
      return 'blockquote'
    case 'table':
      return 'table'
    default:
      return 'p'
  }
}
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
      <table v-else-if="block.type === 'table'" v-html="block.html"></table>
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
.article-body table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; font-size: 0.9375rem; }
.article-body th, .article-body td { border: 1px solid #e2e8f0; padding: 0.625rem 1rem; text-align: left; }
.article-body th { background: #f8fafc; font-weight: 600; color: #0f172a; }
</style>
