import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/common'

/**
 * markdown -> HTML 转换工具
 *
 * 模拟内部项目后端返回的 page.content（整段 HTML 字符串）。
 * - 普通代码围栏：输出带头部栏（语言标识 + 复制按钮）的 .code-block 结构，
 *   代码内容经 hljs 高亮（内部完成 HTML 转义），未识别语言时纯转义输出。
 * - mermaid 围栏：输出占位结构，源码藏于隐藏 <pre> 中，
 *   由 PostContent 挂载后二次解析渲染为 SVG。
 * - 原始 HTML 标签不放行（html: false），源文件中的 HTML 一律按文本转义，杜绝注入。
 */

const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: false,
})

/** 高亮代码内容；语言不受支持或高亮失败时回退为纯转义文本 */
function highlightCode(code: string, langName: string): string {
  if (langName && hljs.getLanguage(langName)) {
    try {
      return hljs.highlight(code, { language: langName, ignoreIllegals: true }).value
    } catch {
      // fallthrough：高亮异常时按纯文本处理
    }
  }
  return md.utils.escapeHtml(code)
}

/** 提取 fence info 串中的语言名（首个空白前的部分） */
function resolveLangName(info: string): string {
  return info.trim().split(/\s+/g)[0] ?? ''
}

md.renderer.rules.fence = (tokens, idx): string => {  const token = tokens[idx]
  const langName: string = resolveLangName(token.info)

  if (langName === 'mermaid') {
    // mermaid-source 默认由 CSS 隐藏（不用内联样式，否则 fallback 时无法恢复显示）
    return (
      `<div class="mermaid-block">` +
      `<pre class="mermaid-source">${md.utils.escapeHtml(token.content)}</pre>` +
      `<div class="mermaid-container"></div>` +
      `</div>\n`
    )
  }

  const langLabel: string = langName || 'text'
  const highlighted: string = highlightCode(token.content, langName)

  return (
    `<div class="code-block" data-lang="${md.utils.escapeHtml(langLabel)}">` +
    `<div class="code-header">` +
    `<span class="code-lang">${md.utils.escapeHtml(langLabel)}</span>` +
    `<button class="code-copy-btn" type="button">复制</button>` +
    `</div>` +
    `<pre><code class="hljs language-${md.utils.escapeHtml(langLabel)}">${highlighted}</code></pre>` +
    `</div>\n`
  )
}

/**
 * 表格外包裹可聚焦的横向滚动容器（恢复 TableBlock 组件退役前的宽表格行为）。
 * 容器不超过正文宽度，宽表格仅在容器内横滚；tabindex=0 使浏览器原生支持
 * 聚焦后方向键滚动，无需额外 JS。
 */
md.renderer.rules.table_open = (tokens, idx, options, _env, self): string =>
  `<div class="table-block" role="region" aria-label="可横向滚动的文章表格" tabindex="0">\n` +
  self.renderToken(tokens, idx, options)

md.renderer.rules.table_close = (tokens, idx, options, _env, self): string =>
  self.renderToken(tokens, idx, options) + `</div>\n`

/** 将 markdown 原文渲染为整段 HTML 字符串 */
export function renderMarkdown(source: string): string {
  return md.render(source)
}
