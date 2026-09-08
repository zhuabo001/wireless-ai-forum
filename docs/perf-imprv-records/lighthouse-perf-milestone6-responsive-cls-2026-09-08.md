# 里程碑 6：响应式 CLS 快检与 minHeight 分档（2026-09-08）

> 分支：`perf/responsive-cls-check`。前序：`lighthouse-perf-milestone5-throttled-comparison-2026-08-13.md`。
> 性质：**检测 + 修复**（先测量后改码，非纯测量里程碑）。任务等级：`L2`（正式闭环）。
> 计划：`docs/plans/refactor/responsive-cls-check-plan.md`｜进度：`docs/plans/refactor/responsive-cls-check-plan-progress.md`

## 1. 背景与目标

第三方评审盲点 R2（`docs/todo/perf-review-followups.md`）：首页 IO 懒加载的 `minHeight` 占位只在
1280×800 桌面实测过一次（engineering 1246 / forum 945 …，`offsetHeight`），响应式从未验证。
占位是 min-height **下界**，而除 forum 外全部区块高度由断点列数主导，窄视口真实高度可达桌面值的
2-3 倍——正常滚动由 `rootMargin: 400px` 把占位→真实的切换推到屏外，但跳转直达 / 快速滚动会落在
占位壳上，失配直接转化为 CLS 或留白。

S2 目标：375×812 与 768×1024 跑既有 trace 管线核对占位 vs 实际高度；失配则修复（方案 A：
minHeight 按断点分档，保留 IO 懒加载架构，桌面 ≥1280 沿用历史值 → 桌面行为零变化）。

## 2. 测量环境与协议

- 生产构建 + `vite preview`（localhost:4173）；chrome-devtools MCP；**无 CPU/网络节流**（快检口径，
  与 M5 的 4x 口径区分）；同一 Chrome 会话、单一 MCP 实例。
- 视口经 `emulate` 设置（`resize_page` 不带 dpr/mobile）：`375x812x3,mobile,touch`、
  `768x1024x2,touch`、`1280x800x2`（对照）。
- 每视口：丢弃式预热 1 次 → 3 轮 `performance_start_trace`（`autoStop:false` 手动停，防 about:blank
  提前截停）→ 每轮导航后执行「场景 A：渐进滚动全挂载」并采集；场景 B（跳转直达）对失配区块执行。
- 宽度 sweep（不落 trace，同一已全挂载页面逐宽度 `emulate`）：
  `[320, 375, 414, 480, 640, 700, 768, 769, 896, 1024, 1088, 1152, 1216, 1280]`
  ——1088/1216 为实施中补采（engineering 高度随宽度连续上升，需更细采样才能分档）。
- 插桩（`evaluate_script`，observer 均 `buffered:true`，导航后补装可捕捉全程）：
  1. `PerformanceObserver('layout-shift')`：跳过 `hadRecentInput`，逐条记录 `{value, t, sources[{label, dy}]}` 并累计 `__cls`；
  2. `MutationObserver`：记录每个 `section[id]` 首次出现子节点的时刻（含 `#hero`，用于隔离异步日历）；
  3. `DOMContentLoaded` 初始态快照：逐 section 记录 `style.minHeight`（占位档位是否生效的端到端证据）。
  4. 注入首步覆写 `scroll-behavior: auto`（`src/assets/main.css:13` 的 smooth 会让直达时序不确定）。
- 官方 CLS 交叉核对：本地解压 trace 取 `CumulativeShiftScore::AllFrames::UMA`（不依赖 MCP 汇总输出）。
- 判定规则（检测与验收共用）：`delta = 真实 offsetHeight − 占位值`
  - PASS `|delta| ≤ 24px`；WARN(over) `-max(64px,3%·H) ≤ delta < -24px`；FAIL(under) `delta > +24px`；
    FAIL(over) `delta < -max(64px,3%·H)`。
  - 非对称是刻意的：under 是 CLS 方向（内容下推），阈值收紧；over 只是留白（挂载时页面变矮，
    且发生在屏外），放宽。

## 3. 结果

### 3.1 修复前失配矩阵（占位 = 桌面历史标量）

**375×812**（真实高度取 3 轮一致值）：

| 区块 | 真实 | 占位 | delta | 判定 |
| --- | --- | --- | --- | --- |
| engineering | 1014 | 1246 | −232 | FAIL(over) |
| practices | 1500 | 732 | +768 | FAIL(under) |
| toolbox | 968 | 652 | +316 | FAIL(under) |
| intelligence | 1207 | 637 | +570 | FAIL(under) |
| courses | 1992 | 896 | +1096 | FAIL(under) |
| atmosphere | 1250 | 642 | +608 | FAIL(under) |
| forum | 1053 | 945 | +108 | FAIL(under) |
| market | 1620 | 820 | +800 | FAIL(under) |
| roadmap | 1446 | 740 | +706 | FAIL(under) |

→ **9/9 FAIL**；真实高度为占位的 1.4-2.7 倍。

**768×1024**：

| 区块 | 真实 | 占位 | delta | 判定 |
| --- | --- | --- | --- | --- |
| engineering | 979 | 1246 | −267 | FAIL(over) |
| practices | 934 | 732 | +202 | FAIL(under) |
| toolbox | 668 | 652 | +16 | PASS |
| intelligence | 780 | 637 | +143 | FAIL(under) |
| courses | 1170 | 896 | +274 | FAIL(under) |
| atmosphere | 956 | 642 | +314 | FAIL(under) |
| forum | 945 | 945 | 0 | PASS |
| market | 1010 | 820 | +190 | FAIL(under) |
| roadmap | 1422 | 740 | +682 | FAIL(under) |

→ **7/9 FAIL**（roadmap +682 最重）。

**1280×800 对照**：9 个区块真实高度逐项 = 历史标量（engineering 1246 / practices 732 / toolbox 652 /
intelligence 637 / courses 896 / atmosphere 642 / forum 945 / market 820 / roadmap 740），delta 全 0
→ **9/9 PASS**（历史值逐像素复现，测量协议自洽）。

### 3.2 高度-宽度曲线与档位推导

sweep 曲线（真实渲染高度，px）：

| w | engi | prac | tool | inte | cour | atmo | foru | mark | road |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | 1039 | 1560 | 1016 | 1207 | 1992 | 1354 | 1053 | 1684 | 1479 |
| 375 | 1014 | 1500 | 968 | 1207 | 1992 | 1250 | 1053 | 1620 | 1446 |
| 414 | 1036 | 1480 | 968 | 1169 | 1992 | 1230 | 1017 | 1620 | 1446 |
| 480 | 1022 | 1440 | 952 | 1111 | 1992 | 1230 | 977 | 1620 | 1422 |
| 640 | 964 | 954 | 684 | 780 | 1170 | 1012 | 977 | 1010 | 1422 |
| 700 | 960 | 954 | 684 | 780 | 1170 | 956 | 945 | 1010 | 1422 |
| 768 | 979 | 934 | 668 | 780 | 1170 | 956 | 945 | 1010 | 1422 |
| 769 | 979 | 934 | 668 | 780 | 1170 | 956 | 945 | 1010 | **847** |
| 896 | 1036 | 914 | 652 | 741 | 1170 | 936 | 945 | 1010 | 792 |
| 1024 | 1100 | 752 | 652 | 637 | 896 | 662 | 945 | 820 | 792 |
| 1088 | 1137 | 752 | 652 | 637 | 896 | 662 | 945 | 820 | 792 |
| 1152 | 1173 | 732 | 652 | 637 | 896 | 662 | 945 | 820 | 776 |
| 1216 | 1210 | 732 | 652 | 637 | 896 | 642 | 945 | 820 | 756 |
| 1280 | 1246 | 732 | 652 | 637 | 896 | 642 | 945 | 820 | 740 |

（640 在两个 profile 重复采样：375-profile 966 / 768-profile 962，表内取均值 964（差 ≤4px，mobile 与
desktop 模拟的字体渲染差异）；896 两 profile 完全相同。原始值见 `*-sweep-<w>.json`。）

**档位推导规则**（确定性，由曲线导出）：

1. 强制档位边界 = 布局跳变断点 ∪ `{375, 768, 1280}`。roadmap 的 SCSS 断点是 `max-width: 768px`
   → 1 列，故其 4 列档下界取 **769**（768 整点必须落 1 列档；用 `min-width:768px` 会选错档）。
2. 自窄向宽贪心合并：区间高度范围 `max − min ≤ max(64px, 3%·min)` 才可同档；上界为连续边界时把
   下一采样点也计入区间范围（避免区间上界处的 under 残差）。
3. **档位值取区间最大值** → 占位恒不矮于真实内容，残差结构性只在 over 方向。
4. `1280` 档值 = 历史标量（`max-w-7xl` = 1280px 封顶，≥1280 高度进入平台期 → 桌面零变化的几何依据）。
5. 追加 `minWidth: 0` 档（值 = H(320)），覆盖 320-374。
6. 相邻档值相同的合并为一档（保留较窄的 minWidth），减少无效的 matchMedia 监听。

结果：9 个区块共 46 档。engineering 高度随宽度**上升**（全景图随容器放大：979@768 → 1246@1280），
是唯一非单调区块，其 768-1280 区间需 6 档才满足容差（也是补采 1088/1216 的原因）。

### 3.3 修复后复测（同协议）

| 视口 | FAIL | WARN | 备注 |
| --- | --- | --- | --- |
| 375×812 | 0 | 0 | engineering −22 PASS，其余 delta = 0 |
| 768×1024 | 0 | 1 | engineering −57（over；768 档覆盖 [768,896)，值 1036 = max(H768=979, H896=1036)） |
| 1280×800 | 0 | 0 | 全部 delta = 0（桌面零变化实证） |

- 档位生效实证：各视口 `DOMContentLoaded` 快照的占位内联值逐区块 = 应有档值；roadmap@768 = 1446
  （1 列档）、@769 = 847（4 列档）。
- 真实高度与修复前逐像素相同（375/768 max diff = 0px，1280 逐项相等）——修复只影响挂载前的占位，
  不触碰最终渲染。
- 单测：`resolveMinHeight` 边界（639/640/767/**768/769**/1023/1024/1279/1280、空数组、末档兜底）+
  数据契约（降序、末档 0、1280 值 === 历史标量、375/768 档位值钉值、roadmap 768/769 分档、单调形态）
  共 13 例；`npm run test` 98 例全绿（375/768 钉值经变异验证：把 toolbox@375 改为 900 即红）；
  `npm run check` 退出 0（入口 380.4/141.9 KiB，体积预算仍过）。

### 3.4 CLS（滚动全挂载，场景 A）

| 视口 | 修复前（3 轮） | 修复后 | 归因 |
| --- | --- | --- | --- |
| 375×812 | 0.00 | 0.00（3 轮） | 无 shift |
| 768×1024 | 0.11 | 0.11（3 轮） | **`#hero` dy −824，t≈100ms**（异步日历挂载，与占位无关，修复前后同值） |
| 1280×800 | 0.00 | 0.00（MCP 2 轮 + 同二进制 CDP 1 轮，见 §4.5） | 无 shift |

官方 CLS 与自装 observer 交叉一致（trace `CumulativeShiftScore::AllFrames::UMA`）。768 的 0.11 是
**既有独立问题**：`#hero` 内 `ActivityCalendar`（`HeroSection.vue:12` 的异步组件）挂载导致 hero
内部重排，把下方内容整体下推；不在 S2 范围（S2 只改占位档值），已单列并建议另立项。

### 3.5 跳转直达（场景 B：失配真正转化为 CLS 的路径）

| 场景 | 修复前 | 修复后 |
| --- | --- | --- |
| 375 跳 `#practices` | **CLS 1.0**（sources `#courses` dy +344.8，紧随挂载） | **0**（占位 1500 = 真实 1500，零生长） |
| 375 跳 `#roadmap` / `#courses` | 0.0015（footer 14px）/ 0 | 0 / 0 |
| 768 跳 `#roadmap` | **CLS 0.2362**（footer dy −739.6，紧随挂载 +682 生长） | 主跑 1.1426（footer ±438.6 双条目）；复跑与逐帧诊断轮均 **0**（占位 1446 → 真实 1422，仅 −24） |
| 1280 跳（无 FAIL 区块，未测） | — | — |

修复后 768 跳 `#roadmap` 的**主跑**出现 footer ±438.6 的**双条目瞬态**（v 各 0.5713，合计 1.1426；
`768-after-jumps.json`），但同一跳转在复跑（`768-after-jumps-rerun.json`）与逐帧采样诊断
（`768-after-jump-diag.json`：roadmap 1446→1422 仅 −24 且无对应 shift 条目）中均未复现，CLS 回到
仅含 `#hero` 的 0.1082。瞬态幅度恰等于 market 区块 1010→1448 的差，与 roadmap 的占位 delta（−24）
无关；机制未坐实（疑似懒 chunk 内 Element Plus 样式迟到导致的首帧未样式化），**不归因于占位失配**，
单列见 §4/§6。因此本节的结论口径是：**占位归因的跳转 shift 归零**；768 主跑另有 1 次未复现的挂载瞬态。

## 4. 遇到的问题与解决

1. **`initScript` 在 `documentElement` 尚不存在时执行**：首版插桩的 `scrollBehavior` 覆写与
   `MutationObserver.observe(document.documentElement)` 双双抛错。解决：延迟到 DOM 可用，MO 改
   `observe(document)`。
2. **档位推导脚本的解析方向**：初版脚本把档位按 minWidth 升序存储、解析时取「首个命中」→ 所有宽度
   都命中 `minWidth: 0` 档（占位恒等于 320 档值），与 sweep 曲线明显不符。修正为「取 `minWidth ≤ w`
   的最大档」，并把「降序存储 + 取首个命中」定为 `resolveMinHeight` 的契约（单测钉住
   639/640/767/**768/769**/1023/1024/1279/1280 等边界）。
3. **「取采样点最大值」在上升区间产生 under 残差**：engineering 高度随宽度上升，若档值只取采样点
   最大值，区间上界处（如 1279px）会出现最多 +72px 的 under（CLS 方向）。解决：改为「区间最大值」
   （连续边界计入下一采样点），并补采 1088/1216 使该区间可分档；残差方向由 under 转为 over。
4. **768 跳转的 ±438 瞬态**：见 §3.5。非占位问题、非确定性，未在本任务处理。
5. **MCP 在 1280 第 2 轮 `performance_stop_trace` 后断连**：该轮 trace 已落盘
   （`1280-after-run2.json.gz`，本地解析 CLS = 0.00），但连接失效使第 3 轮无法继续。补测改用
   **同一 Chrome 二进制**（Google Chrome 152）经原生 CDP 重跑一轮（`Emulation.setDeviceMetricsOverride`
   1280×800@2 + 同一插桩，不采 trace）：CLS = 0、9 个占位值与历史标量逐项相等、全部真实高度与
   MCP 两轮逐项一致——产物 `1280-after-cdp-run3.json`（标注版）与 `1280-after-cdp-run3.raw.json`
   （harness 原始 stdout）、harness `cdp-cls-check.mjs`（均在同目录）。
   该轮为**同环境补充 harness**，非协议主链路；1280 的复测口径因此记为「MCP 2 轮 + CDP 1 轮」。

## 5. 最终结论

1. R2 成立且量级远超「小幅偏差」：修复前 375 上 9/9 FAIL（真实高度为占位的 1.4-2.7 倍）、768 上
   7/9 FAIL；跳转直达路径实测到 CLS 1.0（375）与 0.2362（768）。
2. 方案 A 有效：分档后三视口 FAIL = 0（375/1280 无 WARN，768 仅 engineering −57 over），跳转直达的
   **占位归因 shift 归零**（375 三次跳转 0；768 复跑/诊断轮 0，主跑另有 1 次未复现的挂载瞬态
   1.1426，非占位，见 §3.5），真实渲染与修复前逐像素一致，桌面 ≥1280 占位值不变。
3. 「占位恒不矮于真实」是本次设计的不变量：残差结构性只在 over 方向，而 over 在正常滚动下发生在
   屏外（400px 预触发），代价仅为跳转直达场景的少量留白。
4. 附带发现（不在本任务范围，建议另立项）：`#hero` 异步日历挂载在 768 产生 CLS 0.1082；懒 chunk
   组件挂载偶发未样式化瞬态（768 跳转观察到一次 ±438px）。

## 6. 边界与后续

- **不宣称**：真机/真实网络下的绝对 CLS 值（模拟器与真机的字体、滚动条、DPR 差异未覆盖）；
  采样点之间宽度的失配上界（由曲线单调性假设与容差吸收）。
- **已知残余**：engineering 在 768-1280 上升区间的 over 残差最大 64px（WARN）；320-374 档值取
  H(320)，与 375 档值的差最大 **104px**（atmosphere：1354 − 1250，占位偏高方向）；`minHeight`
  档位为静态数据，mock 数据或区块布局变更后会过期（`src/data/home.ts` 注释已写明需重跑本协议）。
- **后续**：`#hero` 异步日历占位（建议 S3 类项目）；懒 chunk 首帧未样式化瞬态（需单独定位 EP
  CSS 加载时序）；真实设备/网络的 RUM 才能坐实绝对值。

## 原始产物

`docs/reports/lighthouse-baseline/responsive-cls/`（gitignored）：

- 修复前：`{375,768,1280}-run{1..3}.json.gz` + 对应 `-heights.json`（含 `__cls`/`__initial`/mounts）；
  `375-jumps*.json`、`768-jumps.json`（场景 B）；
- sweep：`{375,768,1280}-sweep-<w>.json`（14 宽度）；
- 修复后：`{375,768}-after-run{1..3}.json.gz`、`1280-after-run{1..2}.json.gz` + 各自 `-heights.json`
  （1280 第 3 轮为 CDP 补测，无 trace：`1280-after-cdp-run3.json` + `.raw.json` + harness `cdp-cls-check.mjs`）；
  `375-after-jumps.json`、`768-after-jumps.json`、`768-after-jumps-rerun.json`、`768-after-jump-diag.json`。
- 分析脚本（档位推导 / trace 解析）为会话临时文件，未入库；算法与规则已完整记录于 §3.2。
