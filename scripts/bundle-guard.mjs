/**
 * 体积预算守卫的纯逻辑模块。
 *
 * 设计约束：零 IO、零副作用——文件体积一律通过注入的 sizeOf(file) 获取，
 * 使 vitest 可以用假尺寸精确构造越界场景（见 bundle-guard.spec.mjs）。
 * IO 与 CLI 编排留在 verify-build.mjs。
 */

const KIB = 1024

/** 沿 manifest 的 imports 静态边收集入口的静态闭包（含入口自身） */
export function staticClosure(manifest, entryKey) {
  const visited = new Set()
  const pending = [entryKey]

  while (pending.length > 0) {
    const key = pending.pop()
    if (!key || visited.has(key)) continue

    visited.add(key)
    pending.push(...(manifest[key]?.imports ?? []))
  }

  return visited
}

/** 把 key 集合映射为 chunk name 集合（CSS 条目无 name，会被过滤） */
export function namesOf(manifest, keys) {
  return new Set([...keys].map(key => manifest[key]?.name).filter(Boolean))
}

/** 首屏 eager 入口（HTML 入口；动态入口按需加载，不属于首屏） */
export function eagerEntryKeys(manifest) {
  return Object.keys(manifest).filter(key => {
    const entry = manifest[key]
    return Boolean(entry?.isEntry) && !entry?.isDynamicEntry
  })
}

/** 入口静态闭包内出现的 chunk name 集合 */
export function staticallyLoadedNames(manifest, entryKey) {
  return namesOf(manifest, staticClosure(manifest, entryKey))
}

/** 入口静态闭包内所有条目能动态加载到的 chunk name 集合 */
export function dynamicallyLoadedNames(manifest, entryKey) {
  const names = new Set()

  for (const key of staticClosure(manifest, entryKey)) {
    for (const name of namesOf(manifest, manifest[key]?.dynamicImports ?? [])) {
      names.add(name)
    }
  }

  return names
}

/** 按 name 匹配的 chunk key（name 可能重复，如 11 个页面 chunk 都叫 Index） */
export function chunkKeysByName(manifest, name) {
  return Object.keys(manifest).filter(key => manifest[key]?.name === name)
}

/** manifest 模块图内全部 JS 文件（去重） */
export function jsFilesOf(manifest) {
  const files = new Set()

  for (const entry of Object.values(manifest)) {
    if (entry?.file?.endsWith('.js')) files.add(entry.file)
  }

  return [...files]
}

/** manifest 模块图内全部 CSS 文件（顶层 CSS 条目 ∪ 各条目的 css 数组） */
export function cssFilesOf(manifest) {
  const files = new Set()

  for (const entry of Object.values(manifest)) {
    if (entry?.file?.endsWith('.css')) files.add(entry.file)
    for (const css of entry?.css ?? []) files.add(css)
  }

  return [...files]
}

function sumFiles(files, sizeOf) {
  let raw = 0
  let gzip = 0

  for (const file of files) {
    const size = sizeOf(file)
    raw += size.raw
    gzip += size.gzip
  }

  return { rawKb: raw / KIB, gzipKb: gzip / KIB, fileCount: files.length }
}

/** 入口静态闭包内 JS 文件体积合计 */
export function sumClosure(manifest, entryKey, sizeOf) {
  const files = [...staticClosure(manifest, entryKey)]
    .map(key => manifest[key]?.file)
    .filter(file => file?.endsWith('.js'))

  return sumFiles(files, sizeOf)
}

/** 指定 name 的全部 chunk 文件体积合计 */
export function sumByName(manifest, name, sizeOf) {
  const files = chunkKeysByName(manifest, name)
    .map(key => manifest[key]?.file)
    .filter(Boolean)

  return { ...sumFiles(files, sizeOf), matched: files.length }
}

/** 全产物 JS / CSS 体积合计 */
export function sumTotals(manifest, sizeOf) {
  return {
    js: sumFiles(jsFilesOf(manifest), sizeOf),
    css: sumFiles(cssFilesOf(manifest), sizeOf),
  }
}

/**
 * 边界断言（纯逻辑）：策略由调用方以 config 注入，逻辑本身可测试。
 *
 * config = {
 *   forbiddenStatic: { [entryKey]: string[] },   // 这些入口不得静态加载这些 name
 *   requiredDynamic: { [entryKey]: string[] },   // 这些入口必须能动态加载这些 name
 *   eagerForbiddenStatic: string[],              // 首屏 eager 入口不得静态加载这些 name
 * }
 *
 * 配置中引用的入口若不在 manifest 中，会报错而不是真空通过——否则页面重命名会让
 * 整条断言悄悄失效（与预算校验同一原则：守卫不得被静默关闭）。
 */
export function boundaryViolations(manifest, indexHtml, config = {}) {
  const violations = []
  const { forbiddenStatic = {}, requiredDynamic = {}, eagerForbiddenStatic = [] } = config

  const requireEntry = (entryKey, source) => {
    if (manifest[entryKey]) return true

    violations.push(`${source} references unknown manifest entry "${entryKey}"`)
    return false
  }

  for (const [entryKey, forbiddenNames] of Object.entries(forbiddenStatic)) {
    if (!requireEntry(entryKey, 'forbiddenStatic')) continue

    const loadedNames = staticallyLoadedNames(manifest, entryKey)

    for (const name of forbiddenNames) {
      if (loadedNames.has(name)) violations.push(`${entryKey} must not statically load ${name}`)
    }
  }

  for (const entryKey of eagerEntryKeys(manifest)) {
    const loadedNames = staticallyLoadedNames(manifest, entryKey)

    for (const name of eagerForbiddenStatic) {
      if (loadedNames.has(name)) violations.push(`${entryKey} must not statically load ${name}`)
    }
  }

  for (const [entryKey, expectedNames] of Object.entries(requiredDynamic)) {
    if (!requireEntry(entryKey, 'requiredDynamic')) continue

    const dynamicNames = dynamicallyLoadedNames(manifest, entryKey)

    for (const name of expectedNames) {
      if (!dynamicNames.has(name)) violations.push(`${entryKey} must dynamically load ${name}`)
    }
  }

  const resourceUrls = [...indexHtml.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1])

  if (resourceUrls.length === 0) {
    violations.push('dist/index.html must reference built resources')
  }

  const nonRootUrls = resourceUrls.filter(url => !url.startsWith('/'))

  if (nonRootUrls.length > 0) {
    violations.push(`built resource URLs must be root-absolute, received: ${nonRootUrls.join(', ')}`)
  }

  return violations
}

const METRICS = [
  { actualKey: 'rawKb', limitKey: 'maxRawKb', label: 'raw' },
  { actualKey: 'gzipKb', limitKey: 'maxGzipKb', label: 'gzip' },
]

const LIMIT_KEYS = METRICS.map(metric => metric.limitKey)

function isPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

/**
 * 校验单个 scope 的上限声明。
 * 两个指标必须同时存在：只声明其一（或拼错键名）会让另一维度永久不被检查，
 * 等价于悄悄关闭一半守卫——这正是本守卫要防的失效模式。
 */
function validateLimits(scopeLabel, limits, configErrors) {
  if (!limits || typeof limits !== 'object') {
    configErrors.push(`${scopeLabel} must be an object with ${LIMIT_KEYS.join('/')}`)
    return
  }

  for (const key of Object.keys(limits)) {
    if (!LIMIT_KEYS.includes(key)) {
      configErrors.push(`${scopeLabel}.${key} is not a recognized limit key (expected ${LIMIT_KEYS.join('/')})`)
    }
  }

  for (const key of LIMIT_KEYS) {
    if (limits[key] === undefined) {
      configErrors.push(`${scopeLabel}.${key} is required (missing limits must not be silently disabled)`)
      continue
    }
    if (!isPositiveNumber(limits[key])) {
      configErrors.push(`${scopeLabel}.${key} must be a positive finite number`)
    }
  }
}

const TOTAL_LIMIT_KEYS = ['maxJsRawKb', 'maxJsGzipKb', 'maxCssRawKb', 'maxCssGzipKb']

function validateTotals(totals, configErrors) {
  if (!totals || typeof totals !== 'object') {
    configErrors.push(`totals must be an object with ${TOTAL_LIMIT_KEYS.join('/')}`)
    return
  }

  for (const key of Object.keys(totals)) {
    if (!TOTAL_LIMIT_KEYS.includes(key)) {
      configErrors.push(`totals.${key} is not a recognized limit key (expected ${TOTAL_LIMIT_KEYS.join('/')})`)
    }
  }

  for (const key of TOTAL_LIMIT_KEYS) {
    if (totals[key] === undefined) {
      configErrors.push(`totals.${key} is required (missing budgets must not be silently disabled)`)
      continue
    }
    if (!isPositiveNumber(totals[key])) {
      configErrors.push(`totals.${key} must be a positive finite number`)
    }
  }
}

/** 预算文件顶层结构：缺块或拼错块名会让整组预算静默失效 */
const REQUIRED_BUDGET_BLOCKS = ['entryStaticJs', 'chunks', 'totals']
const KNOWN_BUDGET_KEYS = ['version', 'calibration', ...REQUIRED_BUDGET_BLOCKS]

function validateBudgetShape(budget, configErrors) {
  for (const key of Object.keys(budget)) {
    if (!KNOWN_BUDGET_KEYS.includes(key)) {
      configErrors.push(`unknown top-level key "${key}" in budget file`)
    }
  }

  for (const block of REQUIRED_BUDGET_BLOCKS) {
    if (!budget[block] || typeof budget[block] !== 'object') {
      configErrors.push(`budget.${block} must be a present object (missing budgets must not be silently disabled)`)
    }
  }
}

function makeMeasurement(scope, key, size, limits) {
  return {
    scope,
    key,
    rawKb: size.rawKb,
    gzipKb: size.gzipKb,
    fileCount: size.fileCount,
    limits: { maxRawKb: limits?.maxRawKb, maxGzipKb: limits?.maxGzipKb },
  }
}

/**
 * 按预算评估产物体积。
 *
 * 返回 { ok, measurements, violations, configErrors }：
 * - configErrors：预算文件本身有问题（引用了不存在的 chunk、eager 入口缺预算、数值非法）——
 *   与「预算超限」分开报告，避免守卫被静默关闭。
 *   注：预算声明了构建中不存在的 chunk 视为配置错误（而非静默跳过）——过期的预算条目
 *   等价于被悄悄关闭的守卫；若某 chunk 被彻底移除，应同步删除其预算条目。
 */
export function evaluateBudget(manifest, budget, sizeOf) {
  const configErrors = []
  const measurements = []
  const violations = []

  if (!budget || typeof budget !== 'object') {
    return {
      ok: false,
      measurements,
      violations,
      configErrors: ['budget file must be a JSON object'],
    }
  }

  const entryBudgets = budget.entryStaticJs ?? {}
  const chunkBudgets = budget.chunks ?? {}
  const totalsBudget = budget.totals ?? {}

  // --- 配置校验 ---
  validateBudgetShape(budget, configErrors)

  for (const [entryKey, limits] of Object.entries(entryBudgets)) {
    if (!manifest[entryKey]) {
      configErrors.push(`entryStaticJs references unknown manifest entry "${entryKey}"`)
    }
    validateLimits(`entryStaticJs["${entryKey}"]`, limits, configErrors)
  }

  for (const eagerKey of eagerEntryKeys(manifest)) {
    if (!entryBudgets[eagerKey]) {
      configErrors.push(`eager entry "${eagerKey}" has no entryStaticJs budget`)
    }
  }

  for (const [name, limits] of Object.entries(chunkBudgets)) {
    const matched = chunkKeysByName(manifest, name)

    if (matched.length === 0) {
      configErrors.push(`chunks references unknown chunk name "${name}"`)
    } else if (matched.length > 1) {
      configErrors.push(
        `chunk name "${name}" matches ${matched.length} chunks — budget by name is ambiguous ` +
          '(page chunks share the name "Index"); budget the vendor groups only',
      )
    }

    validateLimits(`chunks["${name}"]`, limits, configErrors)
  }

  validateTotals(totalsBudget, configErrors)

  // --- 测量 ---
  for (const [entryKey, limits] of Object.entries(entryBudgets)) {
    if (!manifest[entryKey]) continue
    measurements.push(makeMeasurement('entryStaticJs', entryKey, sumClosure(manifest, entryKey, sizeOf), limits))
  }

  for (const [name, limits] of Object.entries(chunkBudgets)) {
    const matched = chunkKeysByName(manifest, name)

    if (matched.length === 0 || matched.length > 1) continue

    measurements.push(makeMeasurement('chunk', name, sumByName(manifest, name, sizeOf), limits))
  }

  const totals = sumTotals(manifest, sizeOf)
  measurements.push(
    makeMeasurement('totals', 'JS', totals.js, {
      maxRawKb: totalsBudget.maxJsRawKb,
      maxGzipKb: totalsBudget.maxJsGzipKb,
    }),
  )
  measurements.push(
    makeMeasurement('totals', 'CSS', totals.css, {
      maxRawKb: totalsBudget.maxCssRawKb,
      maxGzipKb: totalsBudget.maxCssGzipKb,
    }),
  )

  // --- 越界判定 ---
  for (const measurement of measurements) {
    for (const metric of METRICS) {
      const limit = measurement.limits[metric.limitKey]
      if (!isPositiveNumber(limit)) continue

      const actual = measurement[metric.actualKey]
      if (actual > limit) {
        violations.push({
          scope: measurement.scope,
          key: measurement.key,
          metric: metric.label,
          actualKb: actual,
          limitKb: limit,
          overPct: ((actual - limit) / limit) * 100,
        })
      }
    }
  }

  return {
    ok: violations.length === 0 && configErrors.length === 0,
    measurements,
    violations,
    configErrors,
  }
}

const padKb = value => (typeof value === 'number' ? value.toFixed(1) : '—')

/** 渲染预算报告文本（成功时列出实测值，失败时列出越界项与配置错误） */
export function formatBudgetReport(result, budgetPath = 'scripts/bundle-budget.json') {
  const lines = []

  if (result.configErrors.length > 0) {
    lines.push(`Budget configuration errors (${result.configErrors.length}):`)
    for (const error of result.configErrors) lines.push(`  ${error}`)
  }

  if (result.violations.length > 0) {
    lines.push('Budget violations (KiB; gzip = zlib level 9, per file):')
    for (const violation of result.violations) {
      lines.push(
        `  ${violation.scope.padEnd(14)} ${violation.key.padEnd(24)} ${violation.metric.padEnd(4)} ` +
          `${padKb(violation.actualKb).padStart(9)} > ${padKb(violation.limitKb).padStart(8)}` +
          `  (+${violation.overPct.toFixed(1)}%)`,
      )
    }
  }

  if (result.ok) {
    lines.push('Bundle budget OK (KiB raw/gzip; gzip = zlib level 9, per file):')
    for (const measurement of result.measurements) {
      lines.push(
        `  ${measurement.scope.padEnd(14)} ${measurement.key.padEnd(24)} ` +
          `${padKb(measurement.rawKb).padStart(8)}/${padKb(measurement.gzipKb).padStart(7)}` +
          `  cap ${padKb(measurement.limits.maxRawKb).padStart(7)}/${padKb(measurement.limits.maxGzipKb).padStart(6)}`,
      )
    }
  } else {
    lines.push(
      `Budgets: ${budgetPath}. If growth is intentional, update the budget in this change ` +
        'and record why in the plan progress file.',
    )
  }

  return lines.join('\n')
}
