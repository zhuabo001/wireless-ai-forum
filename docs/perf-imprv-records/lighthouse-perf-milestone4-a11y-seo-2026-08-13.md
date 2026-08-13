# 里程碑 4：无障碍与 SEO 合规修复（2026-08-13）

> 分支：`feat/lighthouse-perf-optimization`。前序：M3b（BeamsBackground INP 修复）。
> 级别：L2，计划与进度见 `docs/plans/lighthouse-milestone4-a11y-seo-*.md`。

## 1. 背景与目标

基线报告（2026-08-12）记录 9 项失败审计。目标：首页与帖子详情两页的
Accessibility / SEO / Agentic Browsing 失败项清零。起测确认失败项与基线一致
（M1–M3b 的改动未影响无障碍）。

## 2. 数据来源

- 起测报告：`docs/reports/lighthouse-baseline/m4/`（首页）、`m4-post/`（帖子详情）
- 终测报告：`m4-final-home/`、`m4-final-post/`（四维全 100）
- 迭代中报告：`m4-fixed/`、`m4-fixed2/`（暴露懒加载区块与 Footer 的同类隐患）
- 现场 DOM 检查（MCP evaluate_script）：ElCalendar 日期格结构、ticker 标签的
  可访问树状态与计算样式

## 3. 方案

按失败点→组件归属逐项修复（详见 plan 文档）。三条原则：

- **零视觉变化优先**：aria-label、h4→h3（同 class）、main 地标、静态文件不改变
  任何视觉；
- **色比修复取最小增量**：只加深到过 4.5:1 的最近色阶（Tailwind 700 档或相邻
  slate 档）；
- **同类模式全量排查**：审计会随懒加载/滚动行为非确定性地暴露问题，凡发现的
  `*-600-on-*-50` 徽章与低透明度深底文字模式，全仓同模式一并修复。

## 4. 实际动作

1. 起测两页（lighthouse_audit, desktop, navigation），提取全部失败点与 DOM 归属。
2. 实施首轮修复（静态文件 + 9 组件文件）。
3. 重审计迭代两轮：每轮暴露新的同类隐患（懒加载区块徽章 gray-500/gray-100
   4.39 → gray-600；ticker 标签 19 个在可访问树中对比不足 → red/green/amber 700；
   Footer `text-background/40` 3.81 → 50），同模式全仓排查修复。
4. 终测两页全过 + 功能冒烟（robots/llms 服务、aria 落位、日历交互、控制台）。

## 5. 遇到的问题与解决

### 问题 1：审计结果随懒加载状态漂移

首轮修复后重审计，出现首轮未报的失败项（懒加载区块徽章、Footer）。根因：
Lighthouse 的滚动采样行为使懒加载区块与页脚在不同轮次以不同状态进入审计。
**处理**：不把"单轮审计通过"当验收，逐轮清零直至稳定；并对全仓同模式
（rg 排查 `*-600 on *-50`、`text-background/30|40`）预防性修复，避免下一轮再
冒新项。教训：懒加载页面的 a11y 审计需要"轮次收敛 + 模式全量排查"双保险。

### 问题 2：ElCalendar 日期格的语义结构

灰色无活动日期的对比修复需要考虑 ElCalendar 的 DOM 结构。现场确认日期格是
纯 `td > div` 无按钮语义——aria-hidden 方案会剥夺屏幕阅读器的日期信息，弃用；
改为最小视觉增量的 gray-500（4.83:1）。

### 问题 3：ElSelect aria-label 的落点

EP 的 select 由多层元素组成，audit 标记的是内部 `input.el-select__input`。
验证 EP 2.14 支持 `ariaLabel` prop（模板 kebab-case 属性即绑定），终测 DOM 确认
aria-label 落在内部 input 上，label 审计通过。

### 问题 4：独立审查抓出的遗漏与事实分歧（全部处置）

独立代理复跑审计 + 快照审计，抓出三类问题：

- **P1 同模式补漏**：首轮全量排查漏掉 cyan（首屏 ticker，marquee 动画使导航
  审计"运气通过"）与若干懒加载区徽章（rose/emerald/orange/cyan 共 10 处），
  全部 600→700。快照审计复现了完整渲染态下的失败，是比导航审计更强的验证
  场景——已纳入验收标准。
- **P2 heading-order 时序脆弱**：Footer 列标题与 IntelligenceSection 条目标题
  原为 h4，懒加载 h2 区块挂载后形成 H2→H4 跳级；导航审计靠区块未挂载侥幸
  通过。降为 h3，快照审计（10 区块全挂载）0 失败证实。
- **P3 按钮基线的事实分歧**：审查方称 element-overrides.css 早已把 EP primary
  按钮覆盖为深蓝 token。实测证据（起测审计）为渲染值 #409eff——该全局映射因
  EP 样式运行时注入晚于该文件而**整体失效**（预存在问题，本里程碑记录，不在
  范围）。M4 的修复因此从"局部类"升级为全局工具类 `.a11y-primary-button`
  （双类选择器规避注入顺序），ActivityCalendar 与 AgentMarketSection 共用。
  计划文档已补充该发现。

## 6. 最终效果

| 维度 | 首页（前→后） | 帖子详情（前→后） |
| --- | --- | --- |
| Accessibility | 83 → **100** | 82 → **100** |
| SEO | 92 → **100** | 92 → **100** |
| Agentic Browsing | 33 → **100** | 33 → **100** |
| Best Practices | 100 → 100 | 100 → 100 |
| 失败项 | 7 → **0** | 8 → **0** |

三个验证场景全部 0 失败：首页 navigation、帖子详情 navigation、**首页完整渲染态
snapshot**（滚动挂载全部 10 区块后审计——覆盖懒加载时序脆弱性）。

改动文件：`public/robots.txt`、`public/llms.txt`（新建）+ 15 个组件/数据/样式
文件。`npm run check` 全程通过（含 verify-build 深链与懒加载边界校验）。
功能冒烟：日历月份切换与日期选择、评论占位框激活、排序选择器、ticker 徽章
颜色、控制台零 error/warning。

视觉变化诚实声明：色比审计必然要求改色。实际变化为 18 处徽章/文字加深一档
（600→700、gray-500→600、/40→/50、占位文字与注释灰加深、EP primary 按钮
#409eff→#2563eb），无布局、尺寸、动画与交互变化。

## 7. 后续方向

- M5：4x CPU 节流发布级对比，全部性能数字回填基线报告（挂载任务修复复测、
  rAF 循环节流复核、导航交互延迟）。
- 已知范围外（M4 只覆盖两页 + 首页快照）：懒加载路由页的同类徽章模式
  （`pageDesign/intelligence.ts` policy rose-600、`pageDesign/forum.ts` 代码审查
  rose-600、practices 页 ContributorList amber-600 等）——留待后续统一处理。
- 预存在问题：element-overrides.css 的 EP primary token 全局映射因运行时注入
  顺序失效（起测实测 #409eff）——修复属跨页视觉变更，待决策。

## 原始产物

- `docs/reports/lighthouse-baseline/m4/`、`m4-post/`（起测）、`m4-fixed*/`（迭代）、
  `m4-final-home/`、`m4-final-post/`（终测）——Lighthouse 完整报告
- 计划与进度：`docs/plans/lighthouse-milestone4-a11y-seo-*.md`
- 独立审查代理会话记录（`m4-review`，本会话 subagent 转录）
