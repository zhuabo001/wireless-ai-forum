import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { boundaryViolations, evaluateBudget, formatBudgetReport } from './bundle-guard.mjs'

const manifestPath = new URL('../dist/.vite/manifest.json', import.meta.url)
const indexPath = new URL('../dist/index.html', import.meta.url)
const budgetPath = new URL('./bundle-budget.json', import.meta.url)
const distUrl = new URL('../dist/', import.meta.url)

/** 这些入口不得静态加载重量级 vendor（懒加载边界的既有断言，语义保持不变） */
const FORBIDDEN_STATIC_LOADS = {
  'index.html': ['vendor-mermaid', 'vendor-wangeditor', 'vendor-vditor'],
  'src/pages/forum-post-detail/Index.vue': ['vendor-mermaid', 'vendor-wangeditor', 'vendor-vditor'],
  'src/pages/forum-new-topic/Index.vue': ['vendor-mermaid', 'vendor-vditor'],
  'src/pages/challenges/Index.vue': ['vendor-mermaid', 'vendor-wangeditor', 'vendor-vditor'],
  'src/pages/challenge-new/Index.vue': ['vendor-mermaid', 'vendor-vditor'],
  'src/pages/challenge-detail/Index.vue': ['vendor-mermaid', 'vendor-wangeditor', 'vendor-vditor'],
}

/** 这些入口必须能按需（动态）加载到指定 vendor */
const REQUIRED_DYNAMIC_LOADS = {
  'src/pages/forum-post-detail/Index.vue': ['vendor-mermaid', 'vendor-wangeditor'],
  'src/pages/forum-new-topic/Index.vue': ['vendor-vditor'],
  'src/pages/challenge-detail/Index.vue': ['vendor-mermaid', 'vendor-wangeditor'],
}

/** 首屏 eager 入口不得静态加载的大块（EP 只允许被懒入口/懒 chunk 引用） */
const EAGER_FORBIDDEN_STATIC_LOADS = ['vendor-element-plus']

const REBUILD_HINT = 'run `npm run build -- --manifest` first.'

async function readJson(url, label, hint = REBUILD_HINT) {
  let text

  try {
    text = await readFile(url, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`${label} not found — ${hint}`)
    throw error
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`${label} is not valid JSON: ${error.message}`)
    throw error
  }
}

async function readText(url, label) {
  try {
    return await readFile(url, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`${label} not found — ${REBUILD_HINT}`)
    throw error
  }
}

/** 为 manifest 模块图内的每个文件建立 { raw, gzip } 尺寸表，返回 sizeOf(file) */
async function buildSizeOf(manifest) {
  const files = new Set()

  for (const entry of Object.values(manifest)) {
    if (entry?.file) files.add(entry.file)
    for (const css of entry?.css ?? []) files.add(css)
  }

  const sizes = new Map()

  await Promise.all(
    [...files].map(async file => {
      let buffer

      try {
        buffer = await readFile(new URL(file, distUrl))
      } catch (error) {
        if (error.code === 'ENOENT') throw new Error(`manifest references missing build file: ${file}`)
        throw error
      }

      // 逐文件压缩后求和（level 9），与 bundle-budget.json 的 calibration 口径一致
      sizes.set(file, { raw: buffer.length, gzip: gzipSync(buffer, { level: 9 }).length })
    }),
  )

  return file => sizes.get(file) ?? { raw: 0, gzip: 0 }
}

async function main() {
  const manifest = await readJson(manifestPath, 'dist/.vite/manifest.json')
  const budget = await readJson(
    budgetPath,
    'scripts/bundle-budget.json',
    'restore it from version control (it is a tracked source file, not a build artifact)',
  )
  const indexHtml = await readText(indexPath, 'dist/index.html')
  const sizeOf = await buildSizeOf(manifest)

  // EP 只能被懒入口/懒 chunk 引用：eagerForbiddenStatic 只作用于首屏入口，
  // 懒页面 entry（challenge-detail / market 等）静态引用 EP 是期望形态，不能误报
  const boundaries = boundaryViolations(manifest, indexHtml, {
    forbiddenStatic: FORBIDDEN_STATIC_LOADS,
    requiredDynamic: REQUIRED_DYNAMIC_LOADS,
    eagerForbiddenStatic: EAGER_FORBIDDEN_STATIC_LOADS,
  })
  const budgetResult = evaluateBudget(manifest, budget, sizeOf)
  const problemCount = boundaries.length + budgetResult.violations.length + budgetResult.configErrors.length

  if (problemCount > 0) {
    console.error(`Build verification failed: ${problemCount} problem(s)`)

    if (boundaries.length > 0) {
      console.error('\nBoundary violations:')
      for (const violation of boundaries) console.error(`  ${violation}`)
    }

    if (budgetResult.violations.length > 0 || budgetResult.configErrors.length > 0) {
      console.error(`\n${formatBudgetReport(budgetResult)}`)
    }

    process.exitCode = 1
    return
  }

  console.log('Build verification passed: deep-link asset paths and lazy vendor boundaries are intact.')
  console.log(formatBudgetReport(budgetResult))
}

try {
  await main()
} catch (error) {
  console.error(`Build verification failed: ${error.message}`)
  process.exitCode = 1
}
