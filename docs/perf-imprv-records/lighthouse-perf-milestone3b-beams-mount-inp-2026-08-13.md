# 里程碑 3b：BeamsBackground 挂载路径 INP 修复（2026-08-13）

> 分支：`feat/lighthouse-perf-optimization`。
> 前序：`lighthouse-perf-milestone3-layout-attribution-2026-08-13.md`（归因实验）。
> 性质：M3 转向 INP 后的第一项交付——单文件局部修改 + 对照验证。建议 2 的量化
> 测量也在本里程碑完成（结论：无需改动）。

## 1. 背景与目标

M3 归因实验判决：118ms 冷布局是浏览器会话级一次性成本（应用层不可消除），暖态
18–20ms 布局是结构成本，原三根支柱全部倒下。用户决定 M3 转向 **INP 视角**。

INP 审计给出两条建议，本里程碑落地建议 1（确定性修复）并量化建议 2：

- **1a**：消除挂载路径唯一一处强制布局读——`BeamsBackground.vue` 的
  `canvas.getBoundingClientRect()`（全仓 rg 证实仅此一处），冷 trace 中首次全文档
  布局的 stackTrace 即指向它，且"读→写→再布局"模式疑似造成两次全文档布局。
- **1b**：把 `onMounted` 末尾的同步首帧 `draw()`（整幅画布渐变+路径绘制）移出挂载
  任务，只注册 rAF。
- **2 量化**：常驻 rAF 动画循环是否构成持续性 INP 风险——先测主线程每帧成本，
  低于阈值则不动（用户要求不改变视觉效果）。

## 2. 数据来源

- 后测 trace：`docs/reports/lighthouse-baseline/home-trace-beams-mount-fix.json.gz`
  （MCP chrome-devtools `performance_start_trace(reload)`，暖浏览器，无节流
  localhost:4173 生产产物）。
- 前测参照：`exp-normal-run{1,2}.json.gz`（M3 实验的正常变体 trace，同环境、同
  协议、修复前产物，挂载任务 52.3/57.3/54.0/54.4ms 四轮数据中的两轮带事件级细节）。
- 分析：临时脚本 `long-task-breakdown.py`（挂载任务归因）、`post-fcp-raf-probe.py`
  （FCP 后窗口任务直方图与 rAF 列车识别）、`bigtask-composition.py`（大任务下钻）。
- MCP trace 自带 insights（ForcedReflow / LCPBreakdown / RenderBlocking /
  NetworkDependencyTree）。

## 3. 方案

`src/components/BeamsBackground.vue` 两处最小改动：

1. `resize()` 中底片尺寸来源从 `canvas.getBoundingClientRect()` 改为
   `window.innerWidth/innerHeight × dpr`。canvas 位于 HomeLayout 的
   `fixed inset-0` 容器内，CSS 尺寸即视口尺寸；`window.inner*` 是浏览器缓存的
   视口几何，不触发布局。resize 监听保持 `{ passive: true }` 不变。
2. `onMounted` 末尾的同步 `draw()` 改为 `animId = requestAnimationFrame(draw)`，
   首帧绘制发生在下一帧。背景在 z-0 层、被内容覆盖，晚一帧上屏视觉无感。

## 4. 实际动作

1. 实现两处改动（+8/−4 行，含英文注释——该文件既有注释全为英文）。
2. `npm run lint` / `npm run type-check` / `npm run check`（含 build --manifest +
   verify-build 深链与懒加载边界校验）全部通过。
3. 重建产物、重启 vite preview（:4173），MCP Chrome 打开首页并采集 reload trace。
4. 事件级归因：挂载任务构成对比；insights 检查 ForcedReflow 是否消失。
5. FCP 后窗口探针：rAF 列车每帧主线程成本（建议 2 量化）；>5ms 任务排查。
6. 画布冒烟：底片尺寸与 dpr 一致性、中心像素非透明（延迟首帧后仍有绘制）。
7. 独立代理审查改动（需求符合性、正确性、视觉回归、风格），按结论修正注释。

## 5. 遇到的问题与解决

### 问题 1：我给审查代理的错误前提

我在审查提示中声称"该文件既有风格含中文解释性注释"。审查代理用 `git show HEAD`
验证：**原文件零中文字符，既有注释全为英文**。我的声明与事实不符。**处理**：
新增注释改为英文，与文件自身风格统一（仓库多数近期文件的代码注释为中文，但
"匹配周围代码"以文件内 idiom 为准）。

### 问题 2：审查代理的滚动条断言被实测推翻

代理审查断言"Chrome 中 fixed inset-0 盒与 `innerWidth` 都含滚动条槽，宽度完全
相等，不存在偏差"。**实测**（页面有垂直滚动条时）：
`innerWidth=1280`，canvas rect 宽 **1272**——fixed 盒确实排除滚动条槽（8px）。
我的原注释方向正确（"底片比 CSS 盒略宽"），但 "~15px" 是经典桌面滚动条的猜测值。
**处理**：措辞改为"底片可能比 CSS 盒宽一个滚动条宽（亚 1% 拉伸，装饰性背景
不可感知）"，不绑定具体像素数。教训：双方都是推断，以工具实测为准。

### 问题 3：前测 trace 中 FCP 后 84/164ms "长任务"是采集伪影

建议 2 量化时，前测两轮 trace 各出现一个 FCP+~750/833ms 处的大任务
（84.53/164.38ms）。下钻结果：任务窗口内 **只有 1 个 X 事件**（重复的外层
RunTask 壳），内部没有任何 FunctionCall/Layout/GC——是 M2 会话期间 MCP 浏览器
profile 锁竞争、多次断连重连导致的采集伪影，不是真实主线程工作。**处理**：
排除为发现；后测 trace 中 FCP 后 4s 内无任何 >5ms 任务，与前测真实工作形态
（FunctionCall 总量 58.5/29.7ms 散布在亚 5ms 任务中）一致。

### 问题 4：冒烟测试自身的控制台告警

画布像素采样用 `getImageData` 触发 `willReadFrequently` 提示（1 条 warning）。
**判断**：由测试脚本自身引起，非应用代码问题；应用控制台零 error/warning。

## 6. 最终结论

### 6.1 定性

- **ForcedReflow 洞察消失**：后测 trace 的 insights 仅剩 LCPBreakdown /
  RenderBlocking / NetworkDependencyTree，修复前两变体 trace 均报 ForcedReflow。
- 画布冒烟通过：底片 2560×1600 = innerWidth(1280) × dpr(2) 精确；中心与上部
  像素非透明，延迟首帧后动画正常启动。

### 6.2 挂载任务（暖态）

| 指标 | 修复前（4 轮） | 修复后（1 轮） |
| --- | --- | --- |
| 最长挂载任务 | 52.3 / 57.3 / 54.0 / 54.4 ms | **42.98 ms** |
| 任务内 Layout | 18.9–20.2 ms | 17.05 ms |
| 任务内 UpdateLayoutTree | — | 5.18 ms |
| 任务内微任务自耗 | — | 15.81 ms |

**−11.5ms（−21%），落在前测 52.3–57.3ms 带宽之外**（该带宽仅 5ms，挂载任务在
四轮间非常稳定）。机制与预期一致：同步首帧绘制移出 + 中段强制布局消除。诚实
边界：后测仅 1 轮，多轮复测与冷态（118ms 字体地板路径）效果留待 M5 节流环境。

### 6.3 建议 2 量化结果：关闭，无需改动

| 指标 | 修复前（两轮） | 修复后 |
| --- | --- | --- |
| rAF 列车每帧主线程成本 | 均值 0.82 / 0.61 ms，峰值 2.2 / 1.4 ms | 均值 **0.89 ms**，峰值 2.5 ms |

光束动画的**主线程每帧成本亚毫秒**（约 0.9ms），重栅格化发生在合成器/栅格线程
（与 M3 实验中 RasterTask 数据一致），不阻塞输入。亚毫秒级常驻任务对 INP 的
贡献上限 ≈ 1ms 输入延迟，**低于可行动阈值**；零视觉变化的微优化（梯度量化缓存
等）预期仅省 ~0.1–0.3ms/帧，复杂度不值。**不动视觉效果，此条关闭。** 4x CPU
节流下（约 3.6ms/帧）仍低于阈值，M5 复测时顺带复核。

### 6.4 交付证据

- `npm run check` 全绿（lint / type-check / build --manifest / verify-build）。
- 独立代理审查结论：两项需求准确、最小化实现；`animId` 清理路径（含未执行首帧
  的取消）验证闭环；无视觉回归；"可以合入"。审查抓出的两个注释问题已修正
  （见问题 1、2）。
- 工作区仅 `src/components/BeamsBackground.vue` 改动，未触碰任务范围外文件。

## 7. 后续方向

1. **建议 3（导航预取）**：路由 chunk 在链接 hover 时预热——真实设备上最大的
   单次 INP 项，本地无节流不可测，验证并入 M5 节流环境。
2. M4：无障碍 8 项失败审计 + robots.txt/llms.txt 合规（不变）。
3. M5：4x CPU 节流发布级对比——挂载任务修复的多轮复测、rAF 循环节流复核、
   导航交互延迟测量、冷会话地板回填基线报告。

## 原始产物

- `docs/reports/lighthouse-baseline/home-trace-beams-mount-fix.json.gz`：后测
  trace（gitignored，本地留存）。
- 临时分析脚本（会话目录，未入库）：`long-task-breakdown.py`、
  `post-fcp-raf-probe.py`、`post-fcp-bigtasks.py`、`bigtask-composition*.py`。
- 独立审查代理会话记录（`beams-review`，本会话 subagent 转录）。
