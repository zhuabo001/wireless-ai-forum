# S2 响应式 CLS 快检与修复（responsive-cls-check）

日期：`2026-09-08`

来源：`docs/todo/perf-review-followups.md` S2（依据 R2：minHeight 占位仅桌面 1280×800 实测，响应式 CLS 从未验证；375×812 / 768×1024 跑既有 trace 管线核对，失配则修复）

任务等级：`L2`（多文件 + 多个验收条件），走正式闭环。

## 背景与痛点

首页 IO 懒加载的 minHeight 占位是 **1280×800 桌面魔数**（`src/data/home.ts`，engineering 1246 / forum 945 / roadmap 740 …），只取过一次。占位是 min-height **下界**，而除 forum 外全部区块的高度由断点列数主导：窄视口 1-2 列时真实高度可达桌面值的 2-3 倍（roadmap 自写 SCSS `max-width:768px` 4 列→1 列，风险最大）。

正常滚动下 400px rootMargin 预触发让挂载发生在屏外（CLS 归 0.00 的历史结论仍成立），但**跳转直达 / 快速滚动 / find-in-page 会落在占位壳上**：挂载生长把下方内容在视口内下推 → 占位失配真正转化为 CLS 或留白。仓库自评 R2 已确认此缺口，S2 要求先检测后按失配修复。

用户已确认决策：交付 **检测 + 判定 + 修复全链路**；修复方向 = **方案 A：minHeight 按断点分档实测值**（保留 IO 懒加载架构；桌面 ≥1280 沿用历史值 → 桌面行为零变化）。

## 已确认的决策（用户，2026-09-08）

| 决策点 | 选择 |
| --- | --- |
| 交付范围 | 全链路：375×812 / 768×1024 测量 → 失配判定 → 修复（方案 A）→ 复测验证 → 文档收口 |
| 修复方向 | **A：minHeight 按断点分档**（B「移动端去占位直挂」明确不做——丢失 M1 懒加载收益） |
| 任务等级 | L2 正式闭环（plan + progress + 独立复核 + record） |
| 测量口径 | 无节流快检（与 M5 4x 口径区分，记录中声明）；1280×800 对照视口须复现历史值 ±24px |

## 验收条件

1. 失配检测实证：milestone6 §3 含 3 视口×9 区块的占位/真实/delta/分类表；375 与 768 上 FAIL>0（预期多数），1280 对照 FAIL=0 且历史值 ±24px 内复现。
2. 档位生效实证：修复后各视口初始占位内联值逐区块 = 该视口应有档值；roadmap@768 取 1 列档（769 边界），@769 起取 4 列档。
3. 修复后失配清零：375×812、768×1024、1280×800 三视口全部区块 FAIL=0（under 结构性为 0）；WARN 逐条列理由。
4. 桌面零变化：1280×800 下 9 个占位值与修复前标量逐项相等；修复后全挂载真实高度与修复前一致。
5. CLS 不回归：三视口滚动全挂载 3 轮 CLS ≤0.01；跳转直达 top-5 区块 ≤0.01 且无占位归因 shift；hero 异步日历产生的 shift 单列说明、不计入本项。
6. 门禁：`npm run test` 含新增分档/契约单测全绿；`npm run check` 退出码 0（体积预算仍过）。
7. 文档收口：plan/progress/record/milestone6/todo S2 行/基线报告六处一致。
8. 范围纯净：`git status` 仅含任务文件；`docs/handoff/`、`docs/posts/`、`Bn`、`refactor-chat.txt`、`.claude/skills/{generate,run}-playwright-mcp-testcase/` 等既有未跟踪杂项不得提交。

## 技术关键事实（已核实）

- 懒加载唯一实现 `src/components/layout/HomeSection.vue`：`visible = ref(props.minHeight === undefined)`；IO `rootMargin '400px 0px'` 一次性门控；占位为内联 `style.minHeight`，`visible` 翻转同帧移除（无中间态）。无 matchMedia/ResizeObserver。
- `minHeight` 消费点仅 3 处：类型 `src/types/home.ts:196`（`HomeSectionMeta.minHeight?: number`）、数据 `src/data/home.ts:22-30`（9 区块）、组件 prop；`HomePage.vue` 透传无需改。
- 真实布局断点：640（全部区块列数/间距跳变）、1024（8 区块 `lg:grid-cols-3`；engineering/toolbox 无）、**768（仅 RoadMapSection 自写 `@media (max-width:768px)`，`src/sections/RoadMapSection.vue:178-198`）**→ 固定三分档不足，采用**按区块档位数组**；roadmap 档位边界必须用 **769**（768 整点落 1 列档，`min-width:768px` 会选错档）。
- `#hero` 的 `ActivityCalendar` 为异步组件（`HeroSection.vue:12`，切 EP 静态边的既有设计）且无占位：挂载会把下方全部区块整体下推——**独立 CLS 源**，插桩须隔离归因（`#hero` 挂载时刻 + 多区块同 dy 同刻 shift），不在本任务修复。
- `html { scroll-behavior: smooth }`（`src/assets/main.css:13`）+ createWebHistory → 直达场景前须覆写 `scrollBehavior='auto'` 保证时序确定。
- 容器统一 `max-w-7xl`（1280 封顶）→ ≥1280 高度进入平台期，lg 档取历史 1280 值可覆盖全部 ≥1280（桌面零变化的几何依据）。
- 测量协议沿用 M5：build → preview(:4173) → chrome-devtools MCP trace（`autoStop:false` 手动停，防 about:blank 提前截停）；CLS 不自算，走 LayoutShift observer `buffered:true` + sources 节点归因；视口经 `emulate`（viewport 字符串，`resize_page` 不带 dpr/mobile）；首轮 trace 伪影弃轮补测；MCP 多实例竞争先 `pkill`。
- 测试约定：vitest；`src/**/__tests__/*.spec.ts`（先例 `src/api/__tests__/`）。

## 实施内容

### 阶段一：修复前测量（检测，先于代码改动）

- 视口：`375x812x3,mobile,touch`、`768x1024x2,touch`、`1280x800x2`（对照，须复现历史值）。
- 每视口：丢弃式预热 1 次 → 3 轮 trace（场景 A 滚动全挂载）→ 宽度 sweep `[320,375,414,480,640,700,768,769,896,1024,1152,1280]` 不落 trace → 直达场景（失配 top-5 区块 + roadmap@768 必测）。
- 插桩 3 件（evaluate_script，observer 均 `buffered:true` 导航后补装）：LayoutShift 归因 observer（sources 节点 + dy + 累计 `__cls`）、MutationObserver 挂载时刻表（含 `#hero`）、DOMContentLoaded 初始态快照 `__initial`（占位内联值是否生效的端到端证据）。
- 判定规则（阶段一/三共用）：`delta = 真实 offsetHeight − 占位值`。PASS `|delta|≤24px`；WARN(over) 占位偏高 24px~64px|3% 记录不修；**FAIL(under) `delta>+24px` 必修**（CLS 方向，≈一行文字收紧）；FAIL(over) `<-max(64px,3%)` 必修。非对称刻意：under 是 CLS 风险，over 只是留白。
- 归因规则：shift 的 sources 指向目标区块及下方且挂载时刻差 ≤50ms → 占位失配；「多区块同 dy 同刻」且 `#hero` 恰在此时挂载 → hero 异步日历（单列记录）。
- 产物：trace 落 `docs/reports/lighthouse-baseline/responsive-cls/<vp>-run<N>.json.gz`（gitignored）；失配矩阵入 milestone6 §3。

### 阶段二：方案 A 实现（判定 FAIL>0 后；预期必然）

| 文件 | 改动 |
| --- | --- |
| `src/types/home.ts` | 新增 `MinHeightTier { minWidth: number; value: number }`；`HomeSectionMeta.minHeight?: MinHeightTier[]`（缺省 = 首屏立即渲染，语义不变） |
| `src/utils/minHeight.ts`（新） | `resolveMinHeight(tiers, width)`：首个 `width >= minWidth` 命中；空数组兜底 0。纯函数 |
| `src/data/home.ts` | 每区块档位数组（降序、末档 `minWidth:0`），值由 sweep 导出：强制边界 = 布局跳变 ∪ {375, 768, 1280}（roadmap 用 769）；自窄向宽贪心成档，档值 = 档内最大实测 H（结构性消灭 under），并入下一点超 64px/3% 断开；lg 档边界 1280 值 = 历史标量，`H(1024)−历史 >24px` 则插 1024 档；320 抽查 `H(320)−H(375)>24px` 则加 `{minWidth:0}` 档。注释更新为「2026-09-08 多视口实测；数据变更后需重跑测量协议」 |
| `src/components/layout/HomeSection.vue` | prop 类型改数组；`viewportWidth` ref + `placeholderHeight = computed(...)`；onMounted 对 `minWidth>0` 档建 `matchMedia('(min-width:Npx)')` 监听 change（MQL 仅跨档触发，无 resize 抖动），IO 触发 `visible=true` 后与 `onBeforeUnmount` 双路注销；模板绑定 `placeholderHeight` |
| `src/utils/__tests__/minHeight.spec.ts`（新） | 639/640/767/**768/769**/1023/1024/1279/1280、空数组、末档兜底 |
| `src/data/__tests__/homeSections.spec.ts`（新） | 数据契约：每项降序、末档 `minWidth=0`、最大档（1280）值 === 历史标量常量，防误改 |

### 阶段三：修复后复测与收尾

- 同协议复测 3 视口（可省预热）；验收条件 1-6 实证；`npm run check` 全绿。
- 文档：milestone6（M5 模板：§1 背景→§2 环境协议→§3 结果→§4 问题→§5 结论→§6 边界）、progress 五列里程碑表 + 验收实证、record、todo S2 标记、基线报告追加「响应式基线 375/768/1280」小节。

## 里程碑

| 里程碑 | 预期输出 | 验证 |
| --- | --- | --- |
| M1 修复前测量 | 3 视口占位/真实表 + CLS/挂载日志 + 高度-宽度曲线 + 9 条 trace | §阶段一协议；1280 历史值复现；milestone6 §1-4 |
| M2 schema + 纯函数 + 单测 | `MinHeightTier`、`resolveMinHeight`、边界/契约测试 | `npm run test` 全绿 |
| M3 数据档位 + 组件接线 | 9 区块档位数组、matchMedia 选档 | `__initial` 各视口占位值正确；1280 值不变 |
| M4 修复后复测验收 | 三视口 FAIL=0、CLS≤0.01、直达干净 | 验收条件 1-6 |
| M5 收尾 | 独立复核、record、progress 完成、todo、基线追加 | 验收条件 7-8；`npm run check` |

## 风险与边界

- **明确不做**：S3 idle 兜底挂载（跳转直达残余空白态归它）、S4 content-visibility、S5 EP token、非首页页面、真实后端/网络、hero 异步日历修复（若证实其主导直达 shift 只记录并建议另立项）、roadmap 断点本身改 1024（改变 769-1023 视觉，超出 A 范围）、B 方案（移动去占位直挂）。
- **残余**：档内采样间隙与方差（假设高度随宽度单调，容差吸收）；320-374 / 1024-1279 / 768-769 边界残差（按导出规则加档或记录声明）；mock 数据改版使档位过期（注释提醒；自动守卫不做）；模拟器与真机字体/滚动条差异——CLS 判定以布局为主，方向性结论可迁移，不宣称绝对值；resize 跨档仅占位期可见（罕见，记录不修）。
- **回滚**：改动集中在 1 数据 + 1 组件 + 1 纯函数 + 类型，单 commit revert 即恢复桌面行为。

## 端到端验证

1. `npm run check` → lint + type-check + test + build --manifest + verify-build 全绿（基线门禁，实施前跑）。
2. 修复前测量：375×812 / 768×1024 出现 FAIL(under)（预期多数区块，roadmap@768 最严重）；1280×800 对照 FAIL=0。
3. 实现后 `npm run test` 新增单测全绿；`npm run check` 退出码 0。
4. 修复后同协议复测：三视口 FAIL=0、CLS ≤0.01、直达归因干净、1280 占位与真实高度逐项同修复前。
5. 收尾按 close-development-loop：独立复核 → 人工验收 → `records/responsive-cls-check-<日期>.md`。
