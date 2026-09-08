# S2 响应式 CLS 快检与修复（responsive-cls-check）

日期：`2026-09-08`

计划：`docs/plans/refactor/responsive-cls-check-plan.md`

进度：`docs/plans/refactor/responsive-cls-check-plan-progress.md`

任务等级：`L2`

## 目标

补齐第三方评审盲点 R2（`docs/todo/perf-review-followups.md`）：首页 IO 懒加载的 `minHeight` 占位
只在 1280×800 桌面实测过一次，响应式从未验证。占位是 min-height 下界，而多数区块高度由断点列数
主导——窄视口失配会在跳转直达 / 快速滚动时转化为 CLS 或留白。

交付检测 + 判定 + 修复全链路：375×812 与 768×1024 跑既有 trace 管线核对占位 vs 实际高度，
按方案 A（minHeight 按断点分档）修复，并复测验收。桌面 ≥1280 沿用历史值 → 桌面行为零变化。

## 变更文件

| 文件 | 变更 | 影响 |
| --- | --- | --- |
| `src/types/home.ts` | 新增 `MinHeightTier`；`HomeSectionMeta.minHeight` 由标量改分档数组 | 占位数据契约（消费点仅数据/组件两处） |
| `src/utils/minHeight.ts`（新） | `resolveMinHeight(tiers, width)` 纯函数：取 `minWidth ≤ width` 的最大档 | 可单测的选档逻辑 |
| `src/data/home.ts` | 9 个懒加载区块改分档数组（共 46 档，值由 14 宽度 sweep 实测导出）；更新来源注释与维护要求 | 首页懒加载占位高度 |
| `src/components/layout/HomeSection.vue` | 占位高度按视口选档；`matchMedia` 跨档监听（仅占位期，挂载/卸载即注销） | 懒加载门控组件 |
| `src/utils/__tests__/minHeight.spec.ts`（新） | 6 例：档位边界（639/640/767/**768/769**/1023/1024/1279/1280 等）、超宽、末档兜底、空数组 | 单测 |
| `src/data/__tests__/homeSections.spec.ts`（新） | 7 例：档位降序/末档 0/正整数、1280 值 === 历史标量、375/768 档位值钉值、roadmap 768/769 分档、单调形态 | 数据契约守卫（中间档误改即红，已变异验证） |
| `docs/plans/refactor/responsive-cls-check-plan.md`（新） | 计划（L2 正式闭环） | 文档 |
| `docs/plans/refactor/responsive-cls-check-plan-progress.md`（新） | 进度与验收实证 | 文档 |
| `docs/perf-imprv-records/lighthouse-perf-milestone6-responsive-cls-2026-09-08.md`（新） | 测量记录（协议、失配矩阵、档位推导、CLS/跳转、问题与边界） | 文档 |
| `docs/reports/lighthouse-baseline-2026-08-12.md` | 追加「优化记录 4：响应式 CLS 快检与 minHeight 分档」 | 基线 |
| `docs/todo/perf-review-followups.md` | S2 标记为「实现与测量完成，待人工验收」并链接 plan/record | 待办 |

## 验证证据

| 命令或审查 | 结果 | 备注 |
| --- | --- | --- |
| `npm run check`（实施前基线） | 通过 | 入口 378.8/141.5 KiB，`0 violations` |
| `npm run check`（实施后） | 通过 | lint + type-check + 98 例测试 + build --manifest + verify-build；入口 380.4/141.9 KiB（档位数据 +1.6 KiB），预算 440/165 内 |
| `npm run test` | 通过 | 98 例（新增 13 例：utils 6 + data 7） |
| 变异验证（守卫有效性） | 通过 | 把 toolbox@375 档值 968 改为 900 → `375/768 视口占位值 === 档位钉值` 用例失败并报 `toolbox@375: expected 900 to be 968`；还原后全绿 |
| 修复前测量（3 视口 × 3 轮 + 14 宽度 sweep + 跳转） | 完成 | 375 上 9/9 FAIL、768 上 7/9 FAIL、1280 对照 9/9 PASS（delta 全 0）；跳转直达 CLS 1.0（375 `#practices`）/0.2362（768 `#roadmap`） |
| 修复后复测（同协议） | 通过 | 375 FAIL=0/WARN=0、768 FAIL=0/WARN=1（engineering −57 over）、1280 FAIL=0/WARN=0；真实高度与修复前 0px 差 |
| 跳转直达复测 | 通过（占位归因） | 375 三次跳转 CLS 0；768 复跑/逐帧诊断 0（主跑另有 1 次未复现挂载瞬态 1.1426，非占位，见 milestone6 §3.5） |
| CLS 交叉核对（trace `CumulativeShiftScore::AllFrames::UMA`） | 通过 | 375 三轮 0.00；768 三轮 0.1082（**全部 `#hero` 归因**，修复前后同值，既有独立项）；1280 MCP 两轮 0.00 + 同二进制 CDP 补测 0.00 |
| 档位生效实证（`DOMContentLoaded` 快照） | 通过 | 三视口初始占位逐区块命中档值；roadmap 768=1446（1 列）、769=847（4 列）；1280 全部 === 历史标量 |
| 独立复核 | 1 Critical + 4 Important + 8 Minor，已全部处理 | 见下 |

## 本地 commits

| Commit | 范围 |
| --- | --- |
| `ac1f458` | 代码 + 测试：`src/types/home.ts`、`src/utils/minHeight.ts`、`src/data/home.ts`、`src/components/layout/HomeSection.vue` + 两个测试文件（355 insertions） |
| 本记录随此 commit | 文档：plan / progress / milestone6 / record / 基线追加 / todo（用户授权「拆 2 个 commit」） |

## 独立复核

独立复核者（不依赖实施叙述，自行读文件、独立解析 `src/data/home.ts`、逐份比对
`docs/reports/lighthouse-baseline/responsive-cls/` 产物、从 trace 自行提取官方 CLS、亲自运行
`npm run test` / `npm run check`）结论：**代码与数据契约无缺陷**（`resolveMinHeight` 与
`HomeSection.vue` 逻辑经独立实现对拍一致；46 档数据契约成立；14 宽度 × 全区块复算无一 under、
over ≤64px；「768 的 0.11 全部归因 `#hero`」站得住），发现集中在**证据与文档陈述**，已逐条处理：

| # | 级别 | 发现 | 处置 |
| --- | --- | --- | --- |
| C1 | Critical | 1280 修复后第 3 轮/CDP 补测在产物目录中不存在，清点与叙述不实（且「第 3 轮断连」实为第 2 轮） | 补落 `1280-after-cdp-run3.json` + harness `cdp-cls-check.mjs`；§4.5 更正为「第 2 轮 `stop_trace` 后断连，trace 已落盘」；四份文档统一为「MCP 2 轮 + CDP 1 轮」；产物清点改为 `{375,768}-after-run{1..3}`、`1280-after-run{1..2}` + CDP 产物 |
| I1 | Important | 「跳转 CLS 全部归零」过度概括（768 主跑 1.1426），且用「修复前同类瞬态」支撑「与占位无关」属循环论证 | 五处统一为「**占位归因** shift 归零」并显式列出 768 主跑瞬态；删除循环论证，改为「瞬态幅度 = market 1010→1448，与 roadmap 占位 delta −24 无关，机制未坐实」 |
| I2 | Important | 单测边界清单不实（声称覆盖 639/640/767/1023/1024，实际无） | 新增真实档位形态用例，断言 639/640/767/768/769/1023/1024/1279/1280；plan/milestone/record 清单与实际一致 |
| I3 | Important | §6「320-374 与 375 的差 ≤60px」低估（atmosphere 实为 104px） | 改为「最大 104px（atmosphere，占位偏高方向）」 |
| I4 | Important | todo 提前宣告「已完成/已闭环」，与进度/记录状态矛盾 | todo 改为「实现与测量完成，待人工验收」；验收通过后再标 ✅ |
| M1 | Minor | 640 的 964 非任一产物值；sweep 表省略 414/700/1088/1216 | 表内注明 640 = 两 profile 均值（966/962）；补全 14 宽度行 |
| M2 | Minor | WARN 理由区间标错（768-1024 应为 768-896） | 已改为 `[768,896)`，值 1036 = max(979, 1036) |
| M3 | Minor | §4.2 问题叙述与症状不自洽（降序取首个命中本应正确） | 重写为「推导脚本升序存储 + 取首个命中 → 全部命中 0 档」，并说明实现契约为降序 + 首个命中 |
| M4 | Minor | 中间档值无守卫（改 toolbox@375 仍全绿） | 新增 375/768 档位值钉值用例，并做变异验证证明可拦截 |
| M5 | Minor | 378.8 KiB 在当前工作区无法独立复现 | 基线报告注明出处（本次修复前同会话 `npm run check` 实测；S1 校准同量级） |
| M6 | Minor | 1280 缺逐区块数值 | §3.1 补 9 个区块真实高度逐项 |
| M7 | Minor | `viewportWidth` 与 MQL 在滚动条宽度口径上可能差一档 | 实测澄清（同二进制 CDP 探针）：768 视口 `clientWidth` 760 但 `(min-width: 768px)` = true，即 Chrome 媒体查询**含**滚动条宽度，与 `window.innerWidth` 同口径，不存在错档；已把该事实写入 `HomeSection.vue` 注释 |
| M8 | Minor | record 测试清单漏列第 6 例 | 已补（单调形态用例） |

处理后再运行 `npm run test`（98 例全绿）与 `npm run check`（退出 0）。复核者随后**第二轮独立验证**：
亲自重跑 CDP harness（Chrome 152，CLS = 0、占位与高度逐项复现）、live 探针复验 M7、逐条核对处置
清单，并清理了 4 项措辞残留（钉值命名误导、baseline 循环论证残留、CDP 产物溯源格式、progress 轮次
表述），最终判决「**可进入人工验收**」。

## 剩余风险与未验证项

- **不宣称真机/真实网络绝对值**：模拟器与真机的字体、滚动条、DPR 差异未覆盖；CLS 判定以布局为主，方向性结论可迁移。
- **采样间隙**：档位由 14 个宽度采样导出，采样点之间的失配上界由单调性假设与 64px/3% 容差吸收；engineering 在 768-1280 上升区间的 over 残差最大 64px（WARN）。
- **数据驱动过期**：档位是静态数据，mock 数据或区块布局变更后会过期（`src/data/home.ts` 注释要求重跑测量协议）。
- **1280 复测口径偏差**：MCP 在 1280 第 2 轮 `stop_trace` 后断连（该轮 trace 已落盘并本地解析 CLS = 0.00），第 3 轮改用同一 Chrome 二进制经原生 CDP 补测（CLS = 0、占位与高度逐项一致；产物 `1280-after-cdp-run3.json`），为同环境补充 harness，非协议主链路。
- **附带发现（不在本任务范围）**：`#hero` 异步日历挂载在 768 产生 CLS 0.1082；懒 chunk 组件挂载偶发未样式化瞬态（768 跳转主跑观察到一次 footer ±438px，复跑与逐帧诊断未复现，机制未坐实）。

## 人工验收

验收人：`用户（zhuabo001）`

验收证据：用户对交付摘要选择「**验收通过**」，并授权本地 commit（选择「授权：拆 2 个 commit」）。
本记录随第二个（文档）commit 提交；push / PR 未授权、未执行。
