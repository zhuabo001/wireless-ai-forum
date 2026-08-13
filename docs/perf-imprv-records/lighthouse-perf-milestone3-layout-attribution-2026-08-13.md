# 里程碑 3：长任务归因与拉丁替身对照实验（2026-08-13）

> 分支：`feat/lighthouse-perf-optimization`（里程碑 2 已合入 main）。
> 前序：`lighthouse-perf-milestone2-hljs-slim-2026-08-12.md`。
> 性质：本里程碑是**归因与对照实验**，产出的是结论而非代码改动；实验脚手架已移除，
> 工作区无残留。

## 1. 背景与目标

里程碑 2 落盘时，M3 的原计划是"首页残余 render delay——ElCalendar（dayjs+calendar）
替换或延迟、167ms 长任务 requestIdleCallback 拆解"。该计划基于体积推测，缺乏 trace
证据。本里程碑先把 167.5ms 长任务**拆开**，再用**对照实验**验证归因假设：

- 若长任务成本与中文文本量成正比 → M3 做"减少首帧文本量"；
- 若是固定的一次性成本 → M3 原方向作废，另寻出路。

## 2. 数据来源

- **历史 trace 归因拆解**：对已保存的 `home-trace.json.gz`（基线）、
  `home-trace-after-lazy-sections.json.gz`（M1 后）、`post-detail-trace.json.gz`
  做事件级拆解——最长 pre-FCP 任务的直接子事件与 self-time、Layout 事件参数
  （dirtyObjects/totalObjects/layoutRoots）、按 URL 聚合的 FunctionCall 时长。
- **对照实验 trace**：`?latin=1` 拉丁替身页与正常页交替各 2 轮，产物为
  `exp-latin-run{1,2}.json.gz` 与 `exp-normal-run{1,2}.json.gz`
  （均位于 `docs/reports/lighthouse-baseline/`，gitignored）。
- 环境同前序：桌面端、无节流、localhost:4173 生产产物，MCP chrome-devtools 采集。

## 3. 方案：拉丁替身对照实验

唯一变量原则——同 DOM 结构、同样式、同元素数，仅字形系统不同：

- 临时脚手架 `src/utils/latinTextExperiment.ts`（实验后已删除）：访问 `?latin=1` 时，
  在挂载完成、浏览器首帧布局发生**之前**的微任务里，用 TreeWalker 遍历全文档文本节点，
  将 CJK 字符 1:1 替换为 `x`。不触碰任何数据文件，导航/页脚/hero 全部覆盖。
- 测量协议：同一浏览器会话内交替新开标签（每个新标签 = 新渲染进程 = 冷 per-Document
  缓存），`performance_start_trace(reload)` 采集，比较挂载任务的 Layout self-time。
- 已知局限（方向保守）：`x` 重复字形让拉丁整形人为便宜、宽度变窄会轻微改变换行；
  若这样拉丁仍与中文无差，结论只会更稳。

## 4. 实际动作

1. **历史 trace 归因**：167.5ms 长任务 = Layout 118.0ms（全文档布局，dirtyObjects 654，
   全文档仅 989 个布局对象）+ UpdateLayoutTree 13.1ms + 微任务 JS 自耗 21.9ms +
   v8.evaluateModule 8.5ms + GC ~2ms。基线 225.6ms 任务同构（Layout 126.5ms 更大）。
2. **排除 ElCalendar**：M1 后 trace 中 FCP 前没有任何 vendor-element-plus /
   ActivityCalendar chunk 的 JS 执行——原 M3 首要假设出局。
3. **发现冷/热 25 倍差异**：同一 trace 内 305ms 处同规模全文档热布局仅 4.75ms；
   帖子详情页首次布局 0.3ms（暖浏览器新标签）。签名指向浏览器会话级一次性成本，
   主嫌犯为首次 CJK 渲染触发的 PingFang 字体数据同步加载。
4. **实施对照实验**：脚手架 + 构建 + 4 轮交替 trace。
5. **移除脚手架**：删除 `latinTextExperiment.ts`、还原 `main.ts`，工作区复原。

## 5. 遇到的问题与解决

### 问题 1：探针脚本时间单位错误（两次）

分析脚本混用毫秒浮点与事件 `ts` 的微秒整数，过滤条件全空。**解决**：统一以微秒
计算窗口（`nav` 与 `ts` 同单位）。教训：trace 的 `ts`/`dur` 恒为微秒。

### 问题 2：渲染进程选错

trace 捕获整个浏览器，后台残留标签的 marquee/shine 无限动画持续产生 RunTask，
"RunTask 最多者"选中了动画标签的渲染进程，normal-run1 数据错乱。**解决**：改为按
**nav→FCP 窗口内 RunTask 总时长**最大的 CrRendererMain 选择被追踪页面。

### 问题 3：冷态 A/B 无法纯净达成

想杀浏览器获得冷态做 latin/normal 冷对照，但：实验页 `<title>` 为中文，标签栏渲染
标题即触发字体加载；Chrome 被杀后恢复会话（旧标签全中文页）会立即回暖。**处理**：
放弃冷态 A/B。暖态同会话对照已能回答"文本量是否可削减"；冷态对照仅剩科学完整性
价值，决策价值近零，不投入。

### 问题 4：ForcedReflow 洞察

两变体 trace 均报 ForcedReflow：`BeamsBackground.vue:19` 的
`canvas.getBoundingClientRect()` 在挂载路径强制同步布局（冷 trace 中 Layout 的
stackTrace 即指向该挂载调用）。**判断**：修掉该读不会省布局本身（任务末尾必然布局
一次），列为后续卫生项而非本里程碑目标。

## 6. 最终结论

### 6.1 对照实验结果（暖态，同会话配对）

| 轮次 | 变体 | FCP | 挂载任务 | Layout | 样式重算 | 栅格化 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | latin | 150.8ms | 52.3ms | 17.7ms | 9.3ms | 3.8ms |
| 1 | normal | 195.3ms | 57.3ms | 18.9ms | 9.3ms | 14.4ms |
| 2 | latin | 228.4ms | 54.0ms | 20.2ms | 9.1ms | 8.6ms |
| 2 | normal | 286.4ms | 54.4ms | 19.8ms | 8.9ms | 15.0ms |

**CJK 与 Latin 的 Layout 差异 ≈ 0–1.4ms，两变体区间完全重叠。**FCP 的 44–58ms 差
落在已建立的 ±120ms 噪声带内，不做结论。

### 6.2 判决

1. **原假设被否决**："118ms 冷布局 = 中文文本整形冷缓存、减少文本量可削减"不成立。
   文本语种对布局成本几乎无影响。
2. **118ms 是浏览器会话级一次性成本**（高置信推断，未直接坐实）：全新浏览器中首次
   含 CJK 的布局触发系统字体（PingFang）数据的同步加载。证据链：冷 118ms vs 同
   trace 内热态 4.75ms（25×）；暖浏览器新标签首布局 ~19ms；暖态语种无差。
   真实用户每会话只付一次，SPA 内导航不受影响。
3. **应用层不可消除**：成本同步发生在首个需要它的布局里；系统字体无预加载 API；
   连中文 `<title>` 提前触发都改变不了渲染进程内的等待。

### 6.3 附带发现

- 暖态首帧布局本身 **18–20ms**（989 布局对象、600+ dirty 的全文档布局）——可复现的
  结构成本，两变体一致，与文本语种无关。
- CJK 栅格化比拉丁重 2–4 倍（~15ms vs ~5ms），绝对值小，不在优先序。
- ForcedReflow 卫生项：BeamsBackground 的 canvas 尺寸读取（见问题 4）。

### 6.4 对 M3 的影响

M3 原计划三根支柱全部倒下：ElCalendar（本节已排除）、requestIdleCallback 拆解
（没有可拆的大 JS——任务 70% 是布局，拆不了）、减少首帧文本（本实验否决）。
**首页布局这条线：118ms 是不可动的地板，18–20ms 是结构成本，剩余优化空间 ≤10ms 级。**

## 7. 后续方向

1. M3 转向：修复 BeamsBackground 强制布局 + 挂载任务结构优化（INP 视角），或直接
   并入 M4/M5。**该转向的第一项交付已完成**，见
   `lighthouse-perf-milestone3b-beams-mount-inp-2026-08-13.md`。
2. M4：无障碍 8 项失败审计 + robots.txt/llms.txt 合规（不变）。
3. M5：4x CPU 节流发布级对比（不变）；届时可将"冷会话地板 ~100ms"与"暖态结构成本
   ~20ms"写入基线报告的测量方法说明。
4. 可选（不建议）：冷浏览器下 latin/normal 对照以坐实字体机制归因——需重启 MCP
   Chrome 且冷态难纯净达成，决策价值近零。

## 原始产物

- `docs/reports/lighthouse-baseline/exp-latin-run{1,2}.json.gz`、
  `exp-normal-run{1,2}.json.gz`：对照实验 trace（gitignored，本地留存）。
- 历史 trace 归因脚本（临时，未入库）。
