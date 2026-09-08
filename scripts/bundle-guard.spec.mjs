import { describe, it, expect } from 'vitest'
import {
  boundaryViolations,
  chunkKeysByName,
  cssFilesOf,
  dynamicallyLoadedNames,
  eagerEntryKeys,
  evaluateBudget,
  formatBudgetReport,
  staticClosure,
  staticallyLoadedNames,
  sumByName,
  sumTotals,
} from './bundle-guard.mjs'

/**
 * 守卫脚本本身是「信任的支点」：它出错等于给出虚假安全感。
 * 这里用内联 manifest + 注入假 sizeOf 精确构造体积场景，不依赖真实 dist 产物
 * （真实产物链路由 `npm run check` 的 build + verify-build 集成验证）。
 */

const KIB = 1024

const SIZES = new Map([
  ['assets/index.js', { raw: 40 * KIB, gzip: 15 * KIB }],
  ['assets/vendor-vue.js', { raw: 110 * KIB, gzip: 42 * KIB }],
  ['assets/vendor-common.js', { raw: 200 * KIB, gzip: 76 * KIB }],
  ['assets/vendor-ep.js', { raw: 246 * KIB, gzip: 82 * KIB }],
  ['assets/Index-page-a.js', { raw: 10 * KIB, gzip: 4 * KIB }],
  ['assets/Index-page-b.js', { raw: 12 * KIB, gzip: 5 * KIB }],
  ['assets/style.css', { raw: 20 * KIB, gzip: 5 * KIB }],
  ['assets/vendor-ep.css', { raw: 12 * KIB, gzip: 3 * KIB }],
])

const sizeOf = file => SIZES.get(file) ?? { raw: 0, gzip: 0 }

/** 与真实构建同构的最小 manifest：eager 入口 + 两个同名 Index 懒页面 + 只在 css 数组里出现的样式 */
function fixtureManifest() {
  return {
    'index.html': {
      file: 'assets/index.js',
      name: 'index',
      isEntry: true,
      imports: ['_vendor-vue.js', '_vendor-common.js'],
      css: ['assets/style.css'],
    },
    '_vendor-vue.js': { file: 'assets/vendor-vue.js', name: 'vendor-vue' },
    '_vendor-common.js': { file: 'assets/vendor-common.js', name: 'vendor-common' },
    '_vendor-ep.js': { file: 'assets/vendor-ep.js', name: 'vendor-element-plus' },
    // 顶层 CSS 条目（无 name，也不在任何 css 数组里）：只由 cssFilesOf 的顶层分支覆盖
    '_vendor-ep.css': { file: 'assets/vendor-ep.css' },
    'src/pages/a/Index.vue': {
      file: 'assets/Index-page-a.js',
      name: 'Index',
      isDynamicEntry: true,
      imports: ['_vendor-ep.js'],
    },
    'src/pages/b/Index.vue': { file: 'assets/Index-page-b.js', name: 'Index', isDynamicEntry: true },
  }
}

/** 默认预算对 fixture 恰好达标：入口 350/133、EP 246/82、全 JS 618/224、全 CSS 32/8 */
function fixtureBudget(overrides = {}) {
  return {
    version: 1,
    entryStaticJs: { 'index.html': { maxRawKb: 400, maxGzipKb: 150 } },
    chunks: { 'vendor-element-plus': { maxRawKb: 260, maxGzipKb: 90 } },
    totals: { maxJsRawKb: 700, maxJsGzipKb: 250, maxCssRawKb: 40, maxCssGzipKb: 15 },
    ...overrides,
  }
}

describe('依赖图辅助', () => {
  it('staticClosure 含入口自身并沿 imports 传递，不含未引用的 chunk', () => {
    const closure = staticClosure(fixtureManifest(), 'index.html')

    expect(closure.has('index.html')).toBe(true)
    expect(closure.has('_vendor-vue.js')).toBe(true)
    expect(closure.has('_vendor-common.js')).toBe(true)
    expect(closure.has('_vendor-ep.js')).toBe(false)
  })

  it('eagerEntryKeys 只返回 HTML 入口，不含动态页面入口', () => {
    expect(eagerEntryKeys(fixtureManifest())).toEqual(['index.html'])
  })

  it('dynamicallyLoadedNames 沿静态闭包收集动态边', () => {
    const manifest = fixtureManifest()
    manifest['_vendor-common.js'].dynamicImports = ['_vendor-ep.js']

    expect(dynamicallyLoadedNames(manifest, 'index.html').has('vendor-element-plus')).toBe(true)
    expect(dynamicallyLoadedNames(fixtureManifest(), 'index.html').has('vendor-element-plus')).toBe(false)
  })

  it('cssFilesOf 取顶层 CSS 条目与 css 数组的并集', () => {
    const cssFiles = cssFilesOf(fixtureManifest())

    expect(cssFiles).toContain('assets/style.css') // 仅出现在 index.html 的 css 数组
    expect(cssFiles).toContain('assets/vendor-ep.css') // 仅以顶层 CSS 条目存在
  })
})

describe('体积聚合', () => {
  it('sumByName 对同名 chunk 求和并报告匹配数（Index 重名场景）', () => {
    const sum = sumByName(fixtureManifest(), 'Index', sizeOf)

    expect(chunkKeysByName(fixtureManifest(), 'Index')).toHaveLength(2)
    expect(sum.matched).toBe(2)
    expect(sum.rawKb).toBe(22)
    expect(sum.gzipKb).toBe(9)
  })

  it('sumTotals 汇总全部 JS 与 CSS 文件（CSS 含顶层条目）', () => {
    const totals = sumTotals(fixtureManifest(), sizeOf)

    expect(totals.js.rawKb).toBe(618)
    expect(totals.js.gzipKb).toBe(224)
    expect(totals.css.rawKb).toBe(32)
    expect(totals.css.gzipKb).toBe(8)
  })
})

describe('evaluateBudget 越界判定', () => {
  it('全部达标时 ok 为真且无越界项', () => {
    const result = evaluateBudget(fixtureManifest(), fixtureBudget(), sizeOf)

    expect(result.ok).toBe(true)
    expect(result.violations).toEqual([])
    expect(result.configErrors).toEqual([])
    expect(result.measurements).toHaveLength(4) // 入口 + EP chunk + totals JS + totals CSS
  })

  it('raw 超限产出 raw 越界项并带超限百分比', () => {
    const budget = fixtureBudget({ entryStaticJs: { 'index.html': { maxRawKb: 300, maxGzipKb: 150 } } })
    const result = evaluateBudget(fixtureManifest(), budget, sizeOf)

    expect(result.ok).toBe(false)
    expect(result.violations).toHaveLength(1)
    expect(result.violations[0]).toMatchObject({ scope: 'entryStaticJs', key: 'index.html', metric: 'raw' })
    expect(result.violations[0].actualKb).toBeCloseTo(350, 5)
    expect(result.violations[0].overPct).toBeCloseTo(16.67, 1)
  })

  it('gzip 超限产出 gzip 越界项', () => {
    const budget = fixtureBudget({ entryStaticJs: { 'index.html': { maxRawKb: 400, maxGzipKb: 100 } } })
    const result = evaluateBudget(fixtureManifest(), budget, sizeOf)

    expect(result.violations).toHaveLength(1)
    expect(result.violations[0]).toMatchObject({ metric: 'gzip', limitKb: 100 })
    expect(result.violations[0].actualKb).toBeCloseTo(133, 5)
  })

  it('raw 与 gzip 同时超限产出两条越界项', () => {
    const budget = fixtureBudget({ entryStaticJs: { 'index.html': { maxRawKb: 300, maxGzipKb: 100 } } })
    const result = evaluateBudget(fixtureManifest(), budget, sizeOf)

    expect(result.violations.map(v => v.metric).sort()).toEqual(['gzip', 'raw'])
  })

  it('chunk 预算超限按 name 聚合判定', () => {
    const budget = fixtureBudget({ chunks: { 'vendor-element-plus': { maxRawKb: 200, maxGzipKb: 90 } } })
    const result = evaluateBudget(fixtureManifest(), budget, sizeOf)

    expect(result.violations).toEqual([
      expect.objectContaining({ scope: 'chunk', key: 'vendor-element-plus', metric: 'raw', actualKb: 246 }),
    ])
  })
})

describe('evaluateBudget 配置校验（防守卫被静默关闭）', () => {
  it('引用不存在的 chunk name 报配置错误而非越界', () => {
    const budget = fixtureBudget({ chunks: { 'vendor-ghost': { maxRawKb: 10, maxGzipKb: 10 } } })
    const result = evaluateBudget(fixtureManifest(), budget, sizeOf)

    expect(result.ok).toBe(false)
    expect(result.violations).toEqual([])
    expect(result.configErrors.some(error => error.includes('vendor-ghost'))).toBe(true)
  })

  it('eager 入口缺预算报配置错误', () => {
    const result = evaluateBudget(fixtureManifest(), fixtureBudget({ entryStaticJs: {} }), sizeOf)

    expect(result.configErrors.some(error => error.includes('index.html') && error.includes('no entryStaticJs budget'))).toBe(true)
  })

  it('对重名 chunk（Index）设预算报歧义错误', () => {
    const budget = fixtureBudget({ chunks: { Index: { maxRawKb: 100, maxGzipKb: 50 } } })
    const result = evaluateBudget(fixtureManifest(), budget, sizeOf)

    expect(result.configErrors.some(error => error.includes('ambiguous'))).toBe(true)
  })

  it('totals 缺键报配置错误（不得静默跳过）', () => {
    const budget = fixtureBudget({ totals: { maxJsRawKb: 700, maxJsGzipKb: 250 } })
    const result = evaluateBudget(fixtureManifest(), budget, sizeOf)

    expect(result.configErrors.some(error => error.includes('maxCssRawKb'))).toBe(true)
    expect(result.configErrors.some(error => error.includes('maxCssGzipKb'))).toBe(true)
  })

  it('顶层 chunks 块缺失或拼错时不得让整组预算静默失效', () => {
    const { chunks, ...missingBlock } = fixtureBudget()
    expect(
      evaluateBudget(fixtureManifest(), missingBlock, sizeOf).configErrors.some(error =>
        error.includes('budget.chunks'),
      ),
    ).toBe(true)

    const typoBlock = { ...missingBlock, chunk: chunks }
    const result = evaluateBudget(fixtureManifest(), typoBlock, sizeOf)

    expect(result.configErrors.some(error => error.includes('unknown top-level key "chunk"'))).toBe(true)
    expect(result.configErrors.some(error => error.includes('budget.chunks'))).toBe(true)
  })

  it('只声明一个指标时另一维度不得静默失效', () => {
    const budget = fixtureBudget({ entryStaticJs: { 'index.html': { maxRawKb: 400 } } })
    const result = evaluateBudget(fixtureManifest(), budget, sizeOf)

    expect(result.configErrors.some(error => error.includes('maxGzipKb is required'))).toBe(true)
  })

  it('未知的上限键名报配置错误（防拼错后静默失效）', () => {
    const budget = fixtureBudget({
      entryStaticJs: { 'index.html': { maxRawKb: 400, maxGzipKb: 150, maxRawKB: 400 } },
    })
    const result = evaluateBudget(fixtureManifest(), budget, sizeOf)

    expect(result.configErrors.some(error => error.includes('maxRawKB'))).toBe(true)
  })

  it('预算声明的 chunk 不存在时按配置错误处理（不得静默跳过）', () => {
    const manifest = fixtureManifest()
    delete manifest['_vendor-ep.js']
    const result = evaluateBudget(manifest, fixtureBudget(), sizeOf)

    expect(result.ok).toBe(false)
    expect(result.violations).toEqual([])
    expect(result.configErrors.some(error => error.includes('vendor-element-plus'))).toBe(true)
  })
})

describe('EP 仅可被懒 chunk 引用', () => {
  it('懒入口静态引用 EP 不会进入 eager 闭包（避免误报）', () => {
    const manifest = fixtureManifest()

    expect(staticallyLoadedNames(manifest, 'src/pages/a/Index.vue').has('vendor-element-plus')).toBe(true)
    expect(staticallyLoadedNames(manifest, 'index.html').has('vendor-element-plus')).toBe(false)
  })

  it('EP 泄漏进 eager 闭包时可被检出', () => {
    const leaked = fixtureManifest()
    leaked['_vendor-common.js'].imports = ['_vendor-ep.js']

    expect(staticallyLoadedNames(leaked, 'index.html').has('vendor-element-plus')).toBe(true)
  })
})

describe('boundaryViolations（边界断言）', () => {
  const html = '<script type="module" src="/assets/index.js"></script>'
  const config = {
    forbiddenStatic: { 'index.html': ['vendor-mermaid'] },
    requiredDynamic: {},
    eagerForbiddenStatic: ['vendor-element-plus'],
  }

  it('入口静态加载被禁 name 时报错', () => {
    const manifest = fixtureManifest()
    manifest['_vendor-mermaid.js'] = { file: 'assets/vendor-mermaid.js', name: 'vendor-mermaid' }
    manifest['_vendor-common.js'].imports = ['_vendor-mermaid.js']

    expect(boundaryViolations(manifest, html, config)).toEqual([
      'index.html must not statically load vendor-mermaid',
    ])
  })

  it('EP 进入 eager 闭包时报错，懒入口静态引用 EP 不误报', () => {
    expect(boundaryViolations(fixtureManifest(), html, config)).toEqual([])

    const leaked = fixtureManifest()
    leaked['_vendor-common.js'].imports = ['_vendor-ep.js']

    expect(boundaryViolations(leaked, html, config)).toContain(
      'index.html must not statically load vendor-element-plus',
    )
  })

  it('入口缺少必需的动态加载能力时报错', () => {
    const result = boundaryViolations(fixtureManifest(), html, {
      forbiddenStatic: {},
      requiredDynamic: { 'src/pages/a/Index.vue': ['vendor-mermaid'] },
      eagerForbiddenStatic: [],
    })

    expect(result).toEqual(['src/pages/a/Index.vue must dynamically load vendor-mermaid'])
  })

  it('配置引用的入口不存在时报错而非真空通过', () => {
    const result = boundaryViolations(fixtureManifest(), html, {
      forbiddenStatic: { 'src/pages/gone/Index.vue': ['vendor-mermaid'] },
      requiredDynamic: {},
      eagerForbiddenStatic: [],
    })

    expect(result).toEqual(['forbiddenStatic references unknown manifest entry "src/pages/gone/Index.vue"'])
  })

  it('资源路径检查：空引用与非根绝对路径均报错', () => {
    expect(boundaryViolations(fixtureManifest(), '<html></html>', config)).toEqual([
      'dist/index.html must reference built resources',
    ])
    expect(boundaryViolations(fixtureManifest(), '<script src="assets/index.js"></script>', config)).toEqual([
      'built resource URLs must be root-absolute, received: assets/index.js',
    ])
  })
})

describe('formatBudgetReport', () => {
  it('成功报告列出实测值与上限', () => {
    const report = formatBudgetReport(evaluateBudget(fixtureManifest(), fixtureBudget(), sizeOf))

    expect(report).toContain('Bundle budget OK')
    expect(report).toContain('index.html')
    expect(report).toContain('cap')
  })

  it('失败报告含越界项、超限百分比与预算文件路径', () => {
    const budget = fixtureBudget({ entryStaticJs: { 'index.html': { maxRawKb: 300, maxGzipKb: 150 } } })
    const report = formatBudgetReport(evaluateBudget(fixtureManifest(), budget, sizeOf))

    expect(report).toContain('Budget violations')
    expect(report).toContain('(+16.7%)')
    expect(report).toContain('scripts/bundle-budget.json')
  })

  it('配置错误单独成节，不与预算超限混淆', () => {
    const budget = fixtureBudget({ chunks: { 'vendor-ghost': { maxRawKb: 10, maxGzipKb: 10 } } })
    const report = formatBudgetReport(evaluateBudget(fixtureManifest(), budget, sizeOf))

    expect(report).toContain('Budget configuration errors')
    expect(report).not.toContain('Budget violations')
  })
})
