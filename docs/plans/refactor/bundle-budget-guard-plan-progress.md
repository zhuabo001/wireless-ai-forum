# S1 体积预算守卫（verify-build 扩展数值断言） 进度

计划：`docs/plans/refactor/bundle-budget-guard-plan.md`

任务等级：`L2`

范围：`scripts/bundle-guard.mjs`、`scripts/bundle-budget.json`、`scripts/bundle-guard.spec.mjs`、
`scripts/verify-build.mjs`、`vitest.config.ts`、`docs/todo/perf-review-followups.md`

验收条件：见计划「验收条件」章节（共 6 条）

| 里程碑 | 状态 | 预期输出 | 验证证据 | 备注 / 阻塞项 |
| --- | --- | --- | --- | --- |
| M1 预算配置 + 纯逻辑模块 | 完成 | `scripts/bundle-budget.json`（阈值 + calibration 元信息）、`scripts/bundle-guard.mjs`（纯函数，零 IO） | JSON 解析通过；模块导出 13 个纯函数（`staticClosure`/`namesOf`/`eagerEntryKeys`/`staticallyLoadedNames`/`dynamicallyLoadedNames`/`chunkKeysByName`/`jsFilesOf`/`cssFilesOf`/`sumClosure`/`sumByName`/`sumTotals`/`evaluateBudget`/`formatBudgetReport`）；阈值按 policy（vendor ×1.10、入口/总量 ×1.15、vendor-common ×1.20、向上取整 5KiB）由实测值算出 | 实测校准：入口 378.8/141.5、EP 246.5/82.3、全 JS 5121.2/1491.1、全 CSS 190.2/34.1 KiB |
| M2 verify-build 改造 | 完成 | 体积测量（zlib level 9 逐文件）+ 聚合报告 + EP eager 断言 + 预算接入 + `process.exitCode` | `npm run verify-build` 退出 0，打印 10 行实测值/上限；现有 6+5 条边界断言语义保留（边界断言改为收集 `string[]` 后聚合报告）；新增 EP eager 断言 | 实测发现并修正：`totals` 的键是 `maxJsRawKb`/`maxCssRawKb`，通用 `validateLimits` 误判为缺键 → 新增 `validateTotals` |
| M3 单测 + 门禁接入 | 完成 | `scripts/bundle-guard.spec.mjs`（21 例，复核后补至 29）、`vitest.config.ts` include 一行 | `npm run test` → **4 文件 77 例全绿**（原 56 + 守卫 21）；复核补测后 **85 例** | 测试用内联 manifest + 注入假 `sizeOf`，不依赖真实 dist；覆盖同名 `Index` 聚合、EP eager/dynamic 区分、配置校验、报告格式 |
| M4 端到端验证与收尾 | 完成 | 验收条件 1-6 实证、独立复核、record、S1 标记完成 | 见下方「验收条件实证」 | 计划中「chunk 缺失 → skipped 不算失败」与「配置校验：引用的 name 必须能匹配到」自相矛盾，已按验收条件 4 统一为**配置错误**并移除 skipped 机制 |
| 复核修复 | 完成 | 独立 general-purpose agent 自行读代码 / 重算体积 / 复跑门禁 / 构造反例 | 复核结论「可交付」；**1 Important + 8 Minor 全部处理**；测试 77 → **85 例**；对抗性验证 7 个静默失效场景全部被拦截 | I1（配置静默失效：顶层 `chunks` 拼错/缺失、单指标键漏写、未知键名均曾 `ok=true`）已修复；M1 预算缺失提示误导、M2 顶层 CSS 分支无覆盖、M3 边界断言无测试、M4/M5 计划数字与矛盾、M7 chunk 预算口径歧义、M8 入口键不存在真空通过，均已修复；M6（todo 死链）由 record 落地解除 |

允许的状态：`待处理`、`进行中`、`受阻`、`完成`。

## 验收条件实证

| # | 验收条件 | 证据 |
| --- | --- | --- |
| 1 | 当前产物 `npm run check` 通过并打印实测值 | `npm run check` 退出码 **0**；输出 `Test Files 4 passed` / `Tests 77 passed` / `Build verification passed` / `Bundle budget OK` + 10 行实测值（入口 378.8/141.5、EP 246.5/82.3、全 JS 5121.2/1491.1、全 CSS 190.2/34.1） |
| 2 | 预算超限时门禁失败 | 临时把 `entryStaticJs["index.html"].maxGzipKb` 改 100 → `npm run verify-build` 退出码 **1**，报告 `entryStaticJs index.html gzip 141.5 > 100.0 (+41.5%)`；还原后通过 |
| 3 | EP 仅可被懒 chunk 引用被真实拦截 | 临时在 `src/App.vue` 静态引入并渲染 `ElButton` → 重建后 `verify-build` 退出码 **1**，同时命中**边界断言**（`index.html must not statically load vendor-element-plus`）与**数值网**（入口 raw 625.5 > 440、gzip 224.0 > 165）；`App.vue` 还原后重建并通过 |
| 4 | 预算配置错误不被静默忽略 | 把 `chunks` 中 `vendor-element-plus` 改为 `vendor-ghost` → 退出码 **1**，输出 `Budget configuration errors: chunks references unknown chunk name "vendor-ghost"`，未与「预算超限」混排；还原后通过 |
| 5 | 单测纳入门禁并全绿 | `npm run test` → 4 文件 77 例全绿（含 `scripts/bundle-guard.spec.mjs` 21 例） |
| 6 | 测量确定性 | 同一 dist 连续两次 `npm run verify-build` 输出 `diff` 完全一致 |

## 受保护的工作区变更

- 未跟踪文件不得提交：`.claude/skills/generate-playwright-mcp-testcase/`、`.claude/skills/run-playwright-mcp-testcase/`、`docs/handoff/`、`docs/posts/`、`refactor-chat.txt`、`Bn`、`Bn@endumln`
- 明确不动：`vite.config.ts`、`src/**` 业务代码（仅验收条件 3 的临时改动，已还原并以 `git status` 佐证）、`package.json`、`eslint.config.js`、`tsconfig.json`

## 假设与风险

- 事实：node `v22.17.0`，校准 commit `09189e4`；`dist/.vite/manifest.json` 由 `build --manifest` 生成。
- 事实：EP 仅被懒入口/懒 chunk 静态引用（实测）；11 个页面 chunk 的 `name` 均为 `Index`。
- 事实：`zlib.gzipSync(level 9)` 在同一 Node 版本下确定性稳定（验收条件 6 实证）。
- 风险：`setupFiles`（MSW server）会同样作用于 `scripts/**/*.spec.mjs`，实测无功能影响（测试 1.4s 内完成）。
- 风险：`scripts/` 不在 ESLint/`vue-tsc` 覆盖内（`eslint src` + tsconfig include `src/**`），守卫代码只有 vitest 保护——已在计划「明确不做」中记录。
