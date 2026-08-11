<script lang="ts">
// 模块级 mermaid ID 计数器：crypto.randomUUID 仅安全上下文可用，
// HTTP 内网部署会抛错导致图表降级，计数器不依赖任何环境 API 且页面内唯一
let mermaidIdSeed = 0
</script>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElImageViewer } from 'element-plus'
import 'highlight.js/styles/github.css'

const props = defineProps<{
  html: string
}>()


const articleRef = ref<HTMLElement | null>(null)

/** 图片预览状态 */
const previewVisible = ref<boolean>(false)
const previewUrls = ref<string[]>([])
const previewIndex = ref<number>(0)

/** 复制按钮反馈文案的恢复延迟（毫秒） */
const COPY_FEEDBACK_DURATION = 1500

/** 提取代码块内 pre code 的纯文本内容 */
function extractCodeText(codeBlock: Element): string {
  return codeBlock.querySelector('pre code')?.textContent ?? ''
}

/** 复制成功后在按钮上给出短暂反馈 */
function showCopyFeedback(button: HTMLButtonElement): void {
  const originalText: string = button.textContent ?? ''
  button.textContent = '已复制'
  button.classList.add('copied')
  window.setTimeout(() => {
    button.textContent = originalText
    button.classList.remove('copied')
  }, COPY_FEEDBACK_DURATION)
}

/** 点击图片打开放大预览（多图按文档顺序浏览） */
function handleImageClick(img: HTMLImageElement): void {
  const images = Array.from(articleRef.value?.querySelectorAll('img') ?? [])
  const urls: string[] = images.map(el => el.currentSrc || el.src).filter((src: string) => src.length > 0)
  const index: number = images.indexOf(img)
  if (urls.length === 0 || index < 0) return

  previewUrls.value = urls
  previewIndex.value = index
  previewVisible.value = true
}

/** 事件委托处理复制按钮与图片点击（目标元素由 markdown 转换期生成，非 Vue 模板） */
function handleArticleClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null

  const img = target?.closest('img')
  if (img instanceof HTMLImageElement && articleRef.value?.contains(img)) {
    // 图片被 <a> 包裹时阻止跳页，预览优先
    event.preventDefault()
    handleImageClick(img)
    return
  }

  const button = target?.closest('.code-copy-btn')
  if (!(button instanceof HTMLButtonElement)) return

  const codeBlock = button.closest('.code-block')
  if (!codeBlock) return

  const text: string = extractCodeText(codeBlock)
  if (!text) return

  // 非安全上下文（如 http 内网部署）无 clipboard API
  if (!navigator.clipboard) {
    console.warn('[PostContent] 当前环境不支持剪贴板 API，无法复制')
    return
  }

  navigator.clipboard
    .writeText(text)
    .then(() => showCopyFeedback(button))
    .catch((error: unknown) => {
      console.warn('[PostContent] 复制失败:', error instanceof Error ? error.message : error)
    })
}

/** 挂载后二次解析 mermaid 占位块，渲染为 SVG；失败时回退展示源码 */
async function renderMermaidBlocks(): Promise<void> {
  const blocks = articleRef.value?.querySelectorAll('.mermaid-block:not(.mermaid-fallback)')
  if (!blocks || blocks.length === 0) return

  let mermaid: typeof import('mermaid')
  try {
    mermaid = await import('mermaid')
  } catch (error: unknown) {
    console.warn('[PostContent] mermaid 模块加载失败，全部回退为源码展示:', error instanceof Error ? error.message : error)
    blocks.forEach(block => block.classList.add('mermaid-fallback'))
    return
  }

  mermaid.default.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'strict',
  })

  for (const block of Array.from(blocks)) {
    const source: string = block.querySelector('.mermaid-source')?.textContent ?? ''
    const container = block.querySelector('.mermaid-container')
    // 已渲染过的块跳过（html 变化后重复触发时避免重渲染）
    if (!source || !container || container.hasChildNodes()) continue

    try {
      const id = `mermaid-${++mermaidIdSeed}`
      const { svg } = await mermaid.default.render(id, source)
      container.innerHTML = svg
    } catch (error: unknown) {
      console.warn('[PostContent] mermaid 渲染失败，回退为源码展示:', error instanceof Error ? error.message : error)
      block.classList.add('mermaid-fallback')
    }
  }
}

onMounted(() => {
  articleRef.value?.addEventListener('click', handleArticleClick)
  renderMermaidBlocks()
})

// 内容异步到达（如内部项目接口返回 page.content）时重新做 mermaid 二次解析
watch(
  () => props.html,
  async () => {
    await nextTick()
    renderMermaidBlocks()
  },
)

onBeforeUnmount(() => {
  articleRef.value?.removeEventListener('click', handleArticleClick)
})
</script>

<template>
  <article ref="articleRef" class="article-body text-base sm:text-[0.9375rem] mb-16" v-html="html"></article>
  <ElImageViewer
    v-if="previewVisible"
    :url-list="previewUrls"
    :initial-index="previewIndex"
    @close="previewVisible = false"
  />
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
.article-body pre code { background: none; padding: 0; font-size: inherit; }
.article-body img { max-width: 100%; border-radius: 0.625rem; margin: 1.5rem 0; cursor: zoom-in; }
.article-body a { color: #0d55c9; text-decoration: none; }
.article-body a:hover { text-decoration: underline; }

/* 代码块（markdown 转换期生成 .code-block 结构） */
.article-body .code-block { margin: 1.25rem 0; border-radius: 0.625rem; overflow: hidden; border: 1px solid #e2e8f0; }
.article-body .code-block .code-header { display: flex; justify-content: space-between; align-items: center; padding: 0.375rem 0.875rem; background: #e2e8f0; font-size: 0.75rem; color: #64748b; }
.article-body .code-block .code-lang { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; text-transform: lowercase; }
.article-body .code-block .code-copy-btn { color: #475569; cursor: pointer; padding: 0.125rem 0.5rem; border-radius: 0.25rem; transition: background-color 0.15s ease, color 0.15s ease; }
.article-body .code-block .code-copy-btn:hover { background: #cbd5e1; color: #0f172a; }
.article-body .code-block .code-copy-btn.copied { color: #15803d; }
.article-body .code-block pre { margin: 0; border-radius: 0; }

/* mermaid 二次解析 */
.article-body .mermaid-block { margin: 1.5rem 0; }
.article-body .mermaid-block .mermaid-container { display: flex; justify-content: center; overflow-x: auto; }
.article-body .mermaid-block .mermaid-container svg { max-width: 100%; height: auto; }
.article-body .mermaid-block .mermaid-source { display: none; }
.article-body .mermaid-block.mermaid-fallback .mermaid-source { display: block; background: #f1f5f9; padding: 1rem 1.25rem; border-radius: 0.625rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875rem; overflow-x: auto; line-height: 1.65; }
.article-body .mermaid-block.mermaid-fallback .mermaid-container { display: none; }

/* 表格（markdown 转换期包裹 .table-block 滚动容器，恢复宽表格行为） */
.article-body .table-block { width: 100%; max-width: 100%; margin: 1.5rem 0; overflow-x: auto; overscroll-behavior-inline: contain; -webkit-overflow-scrolling: touch; }
.article-body .table-block:focus-visible { outline: 2px solid #0d55c9; outline-offset: 4px; }
.article-body .table-block table { width: max-content; min-width: 100%; margin: 0; border-collapse: collapse; font-size: 0.875rem; }
.article-body .table-block th, .article-body .table-block td { border: 1px solid #e2e8f0; padding: 0.5rem 0.875rem; text-align: left; vertical-align: top; min-inline-size: 8rem; white-space: nowrap; }
.article-body .table-block th { background: #f8fafc; font-weight: 600; color: #0f172a; }
</style>
