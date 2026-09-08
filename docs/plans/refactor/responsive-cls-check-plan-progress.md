# S2 响应式 CLS 快检与修复（responsive-cls-check）进度

计划：`docs/plans/refactor/responsive-cls-check-plan.md`

任务等级：`L2`

范围：`src/types/home.ts`、`src/utils/minHeight.ts`（新）、`src/utils/__tests__/minHeight.spec.ts`（新）、`src/data/home.ts`、`src/data/__tests__/homeSections.spec.ts`（新）、`src/components/layout/HomeSection.vue`；测量与收尾文档（milestone6、record、todo、基线报告、本进度）。**不含**：hero 异步日历修复、S3/S4/S5、非首页页面。

验收条件：计划「验收条件」1-8（失配检测实证 / 档位生效实证 / 失配清零 / 桌面零变化 / CLS 不回归 / 门禁 / 文档收口 / 范围纯净）。

| 里程碑 | 状态 | 预期输出 | 验证证据 | 备注 / 阻塞项 |
| --- | --- | --- | --- | --- |
| M1 修复前测量 | 完成 | 3 视口占位 vs 真实高度表、CLS/挂载日志、14 宽度 sweep、原始 trace | 375 上 9/9 FAIL、768 上 7/9 FAIL、1280 对照 9/9 PASS（delta=0）；矩阵见 milestone6 §3.1 | sweep 追加 1088/1216（engineering 上升区间需更细分档）；基线 `npm run check` exit 0 |
| M2 schema + 纯函数 + 单测 | 完成 | `MinHeightTier`、`resolveMinHeight`、边界/契约单测 | `npm run test` 98 例全绿（新增 13 例：utils 6 + data 7；含真实档位边界 639/640/767/768/769/1023/1024/1279/1280 与 375/768 验收视口钉值，经变异验证可拦截中间档误改） | 单测钉住 768/769 分档、1280 历史值与 375/768 实测值 |
| M3 数据档位 + 组件接线 | 完成 | 9 区块 46 档（值由 sweep 导出）、matchMedia 选档 | `__initial` 快照逐区块命中档值；1280 与历史标量逐项相等；真实高度与修复前 0px 差 | engineering 为非单调区块（高度随宽度上升），独占 9 档 |
| M4 修复后复测验收 | 完成 | 三视口 FAIL=0、CLS≤0.01、跳转归因干净 | 375 FAIL=0/WARN=0；768 FAIL=0/WARN=1；1280 FAIL=0/WARN=0；跳转**占位归因** shift 归零（375 由 1.0 归零；768 复跑/诊断 0，主跑另有 1 次未复现挂载瞬态 1.1426）；见验收实证表 | 1280 第 2 轮末 MCP 断连（该轮 trace 已落盘），第 3 轮改用同二进制原生 CDP 补测（CLS=0，高度逐项一致，产物 `1280-after-cdp-run3{,.raw}.json`） |
| M5 收尾 | 完成 | 独立复核、record、progress 完成、todo S2 ✅、基线追加 | 独立复核两轮（首轮 1C+4I+8M 全部处置；复验判决「可进入人工验收」）+ 人工验收通过 + 本地 2 commits（`ac1f458` 代码/测试 + 文档）；验收条件 7-8；`npm run check` exit 0 | |

## 验收条件实证

| # | 验收条件 | 实证 |
| --- | --- | --- |
| 1 | 失配检测实证：3 视口×9 区块矩阵；375/768 FAIL>0；1280 对照 FAIL=0 且历史值 ±24px 内复现 | milestone6 §3.1：375 9/9 FAIL、768 7/9 FAIL、1280 9/9 PASS（delta 全 0） |
| 2 | 档位生效实证：各视口初始占位 = 应有档值；roadmap@768 1 列档、@769 4 列档 | `__initial` 快照三视口逐区块相等（375: 1036/1500/…/1446；768: 1036/934/…/1446；1280: 历史值）；roadmap 768=1446、769=847 |
| 3 | 修复后失配清零 | 375 FAIL=0/WARN=0；768 FAIL=0/WARN=1（engineering −57 over）；1280 FAIL=0/WARN=0 |
| 4 | 桌面零变化 | 1280 占位值与历史标量逐项相等（MCP 快照 + CDP 补测各一次）；真实高度与修复前逐项一致 |
| 5 | CLS 不回归 | 375 三轮 0.00；768 三轮 0.11（**全部 `#hero` 归因**，修复前后同值，按计划单列不计入）；1280 MCP 两轮 + 同二进制 CDP 补测一轮均 0.00；跳转**占位归因** shift 全 0（768 主跑 1 次未复现挂载瞬态 1.1426，非占位，见 milestone6 §3.5） |
| 6 | 门禁 | `npm run test` 98 例全绿（新增 13 例）；`npm run check` exit 0（入口 380.4/141.9 KiB，预算 440/165 内） |
| 7 | 文档收口 | 本进度 + plan + milestone6 + record + todo + 基线报告 |
| 8 | 范围纯净 | `git status` 仅任务文件；既有未跟踪杂项未提交（见下） |

## 受保护的工作区变更

- 既有未跟踪杂项**不得提交**：`docs/handoff/`、`docs/posts/`、`Bn`、`Bn@endumln`、`refactor-chat.txt`、`.claude/skills/generate-playwright-mcp-testcase/`、`.claude/skills/run-playwright-mcp-testcase/`。
- `docs/reports/lighthouse-baseline/responsive-cls/` 为 gitignored 原始产物区。
- commit / push / 建分支均需用户显式授权（工作流契约动作矩阵）。

## 假设与风险

- 事实：minHeight 消费点仅类型/数据/组件 3 处；布局断点 640/768(仅 roadmap)/1024；`max-w-7xl` 使 ≥1280 高度平台期；1280 对照逐项复现历史值（delta=0）。
- 事实（实测修正）：**engineering 的渲染高度随视口宽度上升**（979@768 → 1246@1280），是全站唯一非单调区块，其分档值在上升区间取区间最大值 → 该区间残差为 over（最大 64px）。
- 假设：区块真实高度在采样点之间连续单调（容差吸收采样间隙；engineering 上升区间已加密采样）。
- 未验证项：真机/真实网络的绝对 CLS；320-374 与 1024-1279 的边界残差（按规则加档或记录声明）；`minHeight` 档位随 mock 数据/布局变更过期（`src/data/home.ts` 注释要求重跑协议）。
- 附带发现（不在本任务范围）：`#hero` 异步日历挂载在 768 产生 CLS 0.1082；懒 chunk 组件挂载偶发未样式化瞬态（768 跳转观察到一次 ±438px，非确定性）。
