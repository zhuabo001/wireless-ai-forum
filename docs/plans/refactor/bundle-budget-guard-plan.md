# S1 体积预算守卫（verify-build 扩展数值断言）

日期：`2026-09-06`

来源：`docs/todo/perf-review-followups.md` S1（依据 R1：新页面从未进 perf 管线，体积增长无守卫）

任务等级：`L2`（多文件 + 多个验收条件），走正式闭环。

## 背景与痛点

M1/M2 的核心战果是「入口静态闭包不再含 vendor-element-plus / mermaid 等大块」（当前入口闭包
378.8 KiB raw / 141.5 KiB gzip）。但 `scripts/verify-build.mjs` 目前**只断言边界、不查体积**：

1. 已断言 mermaid/wangeditor/vditor 不入 6 个入口的静态闭包，**但没有一条断言保护 EP 不在
   `index.html` 静态闭包内**——M1 最大的战果之一处于无守卫状态（已实测确认当前闭包不含 EP，
   但任何一次误引入都不会被发现）。
2. 全产物与各 vendor chunk 的体积无上限，新页面（如挑战英雄榜）多用 EP 组件会持续养肥共享
   chunk，无人察觉。

本次把「体积」纳入 `npm run check` 门禁：超预算即 fail，让体积增长成为**必须有人签字**的动作
（要么优化，要么显式上调预算并说明理由）。仓库无 CI，`check` 是唯一门禁，因此方案以「确定性、
低误报」为第一原则。

## 已确认的决策（用户，2026-09-06）

| 决策点 | 选择 |
| --- | --- |
| 预算数据存放 | 独立 JSON 配置文件 `scripts/bundle-budget.json`（调阈值不改代码、可被文档引用） |
| 阈值语义 | **绝对上限**（不引入相对基线 +5%：无 CI 下「失败→重新生成基线」会让守卫橡皮图章化） |
| 交付形态 | L2 正式闭环（plan + progress + 独立复核 + record） |
| 脚本测试 | 写 vitest 单测（需脚本可注入 dist 路径/尺寸函数） |

## 验收条件

1. 当前产物下 `npm run check` 通过，且 `verify-build` 输出实测值（入口 378.8/141.5、EP 246.5/82.3、全 JS 5121.2/1491.1 KiB 量级）与 `0 violations`。
2. 预算超限时门禁失败：临时把入口 gzip 上限改为 100 → `npm run build -- --manifest && npm run verify-build` 退出码 1，报告含 `index.html gzip 141.5 > 100.0`；还原后重新通过。
3. **EP 仅可被懒 chunk 引用**被真实拦截：临时在 `src/App.vue` 加 `import { ElButton } from 'element-plus'` → 退出码 1 且报 `index.html must not statically load vendor-element-plus`；还原后通过。
4. 预算配置错误不被静默忽略：把 `chunks` 里某个 name 改成不存在的值 → 退出码 1，报「配置错误」而非「预算超限」。
5. 单测纳入门禁：`npm run test` 包含守卫单测（7 类用例，见 M3），全绿。
6. 测量确定性：同一 dist 连续两次 `npm run verify-build` 输出数值完全一致。

## 技术关键事实（已核实）

- `scripts/verify-build.mjs`（79 行）：读 `dist/.vite/manifest.json` + `dist/index.html`；已有
  `staticClosure(entryKey)`、`namesOf(keys)`、`assertNotStaticallyLoaded`、`assertDynamicallyLoads`；
  **顶层副作用**（import 即执行），无导出 → 必须拆出纯模块才能测试。
- manifest chunk key 含 hash（`_vendor-element-plus-C2x7sAxt.js`），**按 `name` 字段聚合**。
- **EP 引用关系（实测）**：EP 仅被懒入口/懒 chunk 静态引用——`src/pages/challenge-detail|challenge-new|forum-new-topic|forum-post-detail|market/Index.vue`、`ActivityCalendar`、`AgentMarketSection`、`EngineeringSection`、`_CommentSection-*.js`。
  → **断言只能针对 eager 入口**（`isEntry && !isDynamicEntry`，当前仅 `index.html`）。若把 EP 加进
  现有那 6 条 `assertNotStaticallyLoaded`，会立刻误报。
- **11 个页面 chunk 的 `name` 都是 `Index`** → 不得按该名设预算（配置校验须拒绝）。
- `dist/.vite/manifest.json` 仅在 `build --manifest` 后存在；`check` 顺序已满足（build 在 verify-build 前）。
- 无任何 CI（无 `.github/workflows` 等）；`eslint src` 与 `vue-tsc`（tsconfig include `src/**`）**都不覆盖 `scripts/`**。
- 环境：node `v22.17.0`，校准 commit `09189e4`。

## 实施内容

### 新增文件

| 文件 | 说明 |
| --- | --- |
| `scripts/bundle-guard.mjs` | 纯逻辑模块（零 IO/零副作用，可被测试直接 import）：`staticClosure(manifest, entryKey)`、`namesOf(manifest, keys)`（由现有实现平移并泛化传参）、`eagerEntryKeys(manifest)`、`chunkKeysByName`、`sumClosure`/`sumByName`/`sumTotals(..., sizeOf)`、`evaluateBudget(manifest, budget, sizeOf)`、`formatBudgetReport(result)`。`sizeOf(file) => {raw, gzip}` 由调用方注入 |
| `scripts/bundle-budget.json` | 阈值数据 + `calibration` 元信息（date/commit/node/gzipLevel/unit/policy/scopeNote） |
| `scripts/bundle-guard.spec.mjs` | vitest 单测：内联 manifest + 注入假 `sizeOf`（不依赖真实 dist） |

### 修改文件

| 文件 | 改动 |
| --- | --- |
| `scripts/verify-build.mjs` | 引入 `node:zlib`；构建 `sizeOf`（`gzipSync(buf, { level: 9 })`，逐文件压缩后求和）；边界断言改为**收集 `string[]` 聚合报告**（语义逐条保留）；**新增 EP eager 断言**；接入 `evaluateBudget` + `formatBudgetReport`；`process.exitCode = 1`；移除 `node:assert/strict` |
| `vitest.config.ts` | include 追加 `scripts/**/*.spec.mjs`（一行）。注意：`setupFiles` 会同样作用于该测试（启动 MSW server，无功能影响） |
| `docs/todo/perf-review-followups.md` | S1 标记完成并链接 plan/record |

### 预算 schema 与阈值

```json
{
  "version": 1,
  "calibration": { "date": "...", "commit": "...", "node": "...", "gzipLevel": 9,
                   "unit": "KiB (1024 bytes)",
                   "policy": "vendor chunk = 实测 x1.10；入口闭包/全产物 = x1.15；vendor-common = x1.20；取整到 5KiB",
                   "scopeNote": "仅统计 manifest 模块图内 JS/CSS；不含 dist/vditor/** 与 public/ 资源" },
  "entryStaticJs": { "index.html": { "maxRawKb": 440, "maxGzipKb": 165 } },
  "chunks": {
    "vendor-element-plus": { "maxRawKb": 275, "maxGzipKb": 95 },
    "vendor-common":       { "maxRawKb": 245, "maxGzipKb": 95 },
    "vendor-vue":          { "maxRawKb": 125, "maxGzipKb": 50 },
    "vendor-mermaid":      { "maxRawKb": 3295, "maxGzipKb": 870 },
    "vendor-wangeditor":   { "maxRawKb": 860,  "maxGzipKb": 295 },
    "vendor-vditor":       { "maxRawKb": 310,  "maxGzipKb": 75 },
    "vendor-katex":        { "maxRawKb": 280,  "maxGzipKb": 85 }
  },
  "totals": { "maxJsRawKb": 5890, "maxJsGzipKb": 1715, "maxCssRawKb": 220, "maxCssGzipKb": 40 }
}
```

阈值以实测 × policy 得出（入口 378.8→440、EP 246.5→275、全 JS 5121.2→5890、全 CSS 190.2→220）；
**实施时按当时构建复测微调**，偏差超 2% 则按 policy 重算并写入 `calibration`。检测力：EP 泄漏进入口
= +246.5 KiB，入口与总量双双越界；新页面把 EP 养肥 +28.5 KiB 即触发（R1 场景被覆盖）。

**口径**：`chunks` 预算统计该 chunk 自身的 JS 文件（不含其 `css` 数组与静态依赖闭包，避免跨 chunk
重复计数）；CSS 由 `totals` 的并集口径兜底。此口径已写入 `bundle-budget.json` 的 `calibration.scopeNote`。

**配置校验（防守卫被静默关闭）**：预算引用的 entry/chunk name 必须能在 manifest 中匹配到；
每个 eager entry 必须有预算；数值必须为正有限数。违反归入 `configErrors`（与超限分开报告）。

## 里程碑

| 里程碑 | 预期输出 | 验证 |
| --- | --- | --- |
| M1 预算配置 + 纯逻辑模块 | `scripts/bundle-budget.json`、`scripts/bundle-guard.mjs` | JSON 可解析；纯函数被 M3 覆盖 |
| M2 verify-build 改造 | 体积测量 + 聚合报告 + EP eager 断言 + 预算接入，退出码语义正确 | `npm run build -- --manifest && npm run verify-build` 退出 0 并打印实测值；现有 6+5 条边界断言行为不变 |
| M3 单测 | `scripts/bundle-guard.spec.mjs`（闭包含自身 / 同名 `Index` 聚合 / raw 超 / gzip 超 / 双超 / 达标 / 未知 name 配置错误 / eager 缺预算 / EP 在 eager 闭包触发而 dynamic 不触发 / 报告含百分比）+ vitest include 一行 | `npm run test` 全绿 |
| M4 端到端验证与收尾 | 验收条件 1-6 的实证记录（含超限与 EP 泄漏的临时改动—还原）、独立复核、record、S1 标记完成 | `npm run check` 全绿；临时改动还原以 `git status` 佐证 |

## 风险与边界

- **误报**：依赖升级/新页面导致合法增长 → 余量 10-20%；失败信息指向预算文件；上调预算必须与增长同 change 并记录理由。
- **chunk 间字节迁移**（rolldown/Vite 小版本、codeSplitting 调整）→ 只对 `vite.config.ts` 钉死 name 的 vendor 组设单 chunk 预算，其余靠总量兜底。
- **gzip 跨 Node 版本抖动**（0.1-0.5%）→ 余量 ≥10% 吸收；`calibration.node` 留档；**不追求与 Vite 报告字节对齐**（rolldown 压缩器实现不同）。
- **重复 name `Index`**：配置校验禁止对其设预算；页面级预算需按 `src` 键控（不做）。
- **chunk 缺失**：预算声明的 chunk 在本次构建中不存在 → **报配置错误**（原计划的「skipped 不算失败」与「配置校验：引用的 name 必须能匹配到」自相矛盾，实施时按后者统一）。过期预算条目等价于被悄悄关闭的守卫；某 chunk 被彻底移除时应同步删除其预算条目。
- **静默失效**（独立复核 Important-1 修复后）：两个指标键必须同时声明、未知键名报错、`entryStaticJs`/`chunks`/`totals` 三块必须存在——只声明其一或拼错块名不再可能让一半守卫无声失效。
- **守卫只在本地**：无 CI，`check` 可被跳过——诚实定位为「提醒」而非「强制」；接 CI 时作为 PR 必过项（可加 `--json` 输出做 annotation）。
- **明确不做**：相对基线 +5%（用户已选绝对上限）；页面级按 `src` 预算；ESLint/type-check 覆盖 `scripts/`（会波及全局配置）。

## 端到端验证

1. `npm run test` → 守卫单测 + 现有 56 例全绿。
2. `npm run check` → lint + type-check + test + build --manifest + verify-build 全绿，verify-build 打印实测值与 `0 violations`。
3. 超限实证：临时把入口 gzip cap 改 100 → `verify-build` 退出 1 且信息精确；还原。
4. EP 泄漏实证：临时在 `src/App.vue` 静态 import 一个 EP 组件 → 退出 1 报 EP 断言；还原并 `git status` 确认干净。
5. 确定性：同一 dist 连续两次 `npm run verify-build` 输出一致。
6. 收尾按 close-development-loop：独立复核 → 人工验收 → `records/bundle-budget-guard-<日期>.md`。
