# S1 体积预算守卫（verify-build 扩展数值断言）

日期：`2026-09-06`

计划：`docs/plans/refactor/bundle-budget-guard-plan.md`

进度：`docs/plans/refactor/bundle-budget-guard-plan-progress.md`

任务等级：`L2`

## 目标

把「产物体积」纳入 `npm run check` 门禁，让体积增长成为必须有人签字的动作。来源是性能评审
`docs/todo/perf-review-followups.md` 的 S1（依据 R1：新页面从未进 perf 管线，体积增长无守卫）。

改造前的关键缺口：`verify-build.mjs` 只断言懒加载边界、不查体积，且**没有一条断言保护
`vendor-element-plus` 不在 `index.html` 静态闭包内**——M1 最大的战果之一处于无守卫状态。

## 变更文件

| 文件 | 变更 | 影响 |
| --- | --- | --- |
| `scripts/bundle-budget.json` | 新增：绝对上限预算（入口静态闭包 / 7 个 vendor chunk / 全 JS+CSS 总量）+ `calibration` 元信息（date/commit/node/gzipLevel/policy/scopeNote/measuredAt） | 阈值可评审、不混入代码 diff |
| `scripts/bundle-guard.mjs` | 新增：纯逻辑模块（零 IO/零副作用）——静态闭包、按 name 聚合、体积求和、预算评估与报告、边界断言 | 可被 vitest 直接 import |
| `scripts/bundle-guard.spec.mjs` | 新增：21 → 29 例单测（内联 manifest + 注入假 `sizeOf`） | 守卫自身有回归保护 |
| `scripts/verify-build.mjs` | 改造：引入 `zlib` 体积测量（逐文件 level 9）、边界断言改为聚合报告、**新增 EP eager 断言**、接入预算评估、`process.exitCode` | 门禁失败一次性列出全部问题 |
| `vitest.config.ts` | include 追加 `scripts/**/*.spec.mjs` | 守卫单测并入 `npm run check` |
| `docs/plans/refactor/bundle-budget-guard-plan.md` / `-progress.md` | 新增：L2 计划与逐里程碑证据 | 交付证据 |
| `docs/todo/perf-review-followups.md` | S1 标记完成并链接本记录 | 清单收口 |

**明确不动**：`vite.config.ts`、`src/**` 业务代码（验收条件 3 的临时改动已还原，`git status` 佐证）、
`package.json`、`eslint.config.js`、`tsconfig.json`。

## 验证证据

| 命令或审查 | 结果 | 备注 |
| --- | --- | --- |
| `npm run check` | 通过（退出码 0） | lint + type-check + **85 例 test** + build --manifest + verify-build 全绿 |
| `npm run verify-build` | 通过 | 打印 10 行实测值/上限：入口 378.8/141.5、EP 246.5/82.3、全 JS 5121.2/1491.1、全 CSS 190.2/34.1（cap 440/165、275/95、5890/1715、220/40） |
| 验收 2：预算超限 | 退出码 1 | 临时把入口 gzip 上限改 100 → `entryStaticJs index.html gzip 141.5 > 100.0 (+41.5%)`；还原后通过 |
| 验收 3：EP 泄漏拦截 | 退出码 1 | 临时在 `src/App.vue` 静态引入并渲染 `ElButton` → **双重命中**：边界断言 `index.html must not statically load vendor-element-plus` + 数值网 `raw 625.5 > 440`、`gzip 224.0 > 165`；还原后重建并通过 |
| 验收 4：配置错误 | 退出码 1 | chunk 名改 `vendor-ghost` → `Budget configuration errors: chunks references unknown chunk name`，未与「预算超限」混排 |
| 验收 6：测量确定性 | 通过 | 同一 dist 连续两次输出 `diff` 为空 |
| 对抗性验证（复核 I1 修复后） | 7/7 拦截 | 顶层 `chunks` 拼错、`chunks` 整块删除、单指标键漏写（entry/chunk）、键名拼错、`totals` 整块删除，全部报配置错误而非 `ok=true` |
| 独立复核 | 可交付 | 见下 |

## 本地 commits

| Commit | 范围 |
| --- | --- |
| `7a47487` | feat: 体积预算守卫接入 verify-build 门禁（预算配置 + 纯逻辑模块 + 29 例单测 + verify-build 改造 + vitest include） |

本记录与计划/进度/todo 收口由同批 docs 提交交付。

## 独立复核

独立 general-purpose agent 自行读代码、独立重算体积、复跑门禁、构造反例（含真实修改 `src/App.vue`
做 EP 泄漏实证），结论：**可交付**——6 条验收条件全部独立复现；`staticClosure` 与改造前逐行同构
（含环状 imports 安全）；体积重算逐位一致；EP 断言作用域正确无误报；退出码语义正确；工作区保护
无问题（复核前后 `git status` 一致，`App.vue` sha 与备份相同）。

发现 **1 Important + 8 Minor**，全部处理：

- **I1（Important）配置校验静默失效**：顶层 `chunks` 拼错/缺失会让 7 个 vendor 预算无声失效；
  只声明 `maxRawKb` 或 `maxGzipKb` 会让另一维度永久不检查 → 修复为「两键必须同时存在、未知键名报错、
  三个顶层块必须存在」，并加 3 例单测与对抗性验证。
- **Minor**：预算文件缺失提示误导（改为「从版本控制恢复」）；`cssFilesOf` 顶层分支无测试覆盖（补
  fixture 与断言）；边界断言无自动化测试（提取为纯函数 `boundaryViolations` 并补 5 例）；
  计划数字滞后与 skipped 矛盾（回填并统一为配置错误）；chunk 预算口径歧义（明确为「仅该 chunk 的
  JS 文件」，CSS 由 totals 兜底）；入口键不存在时真空通过（改为报错并有测试）。

## 剩余风险与未验证项

- **守卫只在本地**：仓库无 CI，`npm run check` 可被跳过——定位为「提醒」而非「强制」。接 CI 时
  作为 PR 必过项（可加 `--json` 输出做 annotation，本期未做）。
- **gzip 跨 Node 版本抖动**（0.1-0.5%）：余量 ≥10% 吸收；`calibration.node` 已留档。
- **阈值腐烂**：cap 长期远低于实测（余量过大）会削弱检测力；上调预算必须与增长同 change 并记录理由。
- **`scripts/` 不在 ESLint / `vue-tsc` 覆盖内**（`eslint src` + tsconfig include `src/**`）：守卫代码
  仅由 vitest 保护，属计划「明确不做」。
- **相对基线 +5% 未做**（用户已选绝对上限）：无法捕捉 cap 之下的慢速渗透，留待 CI 落地后评估。
- **页面级预算未做**：11 个页面 chunk 共用 `name: Index`，需按 `src` 键控，本期不做。

## 人工验收

验收人：`zhuabo001`

验收证据：用户指示「按照你的建议来，提交并推送到远端分支，完成之后使用gh工具创建pr」（2026-09-06）——即对实施范围、验证证据与独立复核结论的明确接受，并授权提交、推送与创建 PR。
