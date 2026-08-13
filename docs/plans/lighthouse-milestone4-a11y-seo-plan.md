# M4 计划：无障碍与 SEO 合规修复（2026-08-13）

> 分支：`feat/lighthouse-perf-optimization`。前序：M3b（BeamsBackground INP 修复）。
> 级别：L2（多文件、多个验收条件），按治理契约逐项实施并记录证据。

## 1. 背景

基线报告（2026-08-12）记录了 9 项失败审计。M4 起测（2026-08-13，M3b 后产物）用
MCP `lighthouse_audit`（desktop, navigation）重跑两页，失败项与基线一致：

| 审计 | 首页 | 帖子详情 | 性质 |
| --- | --- | --- | --- |
| button-name | ❌（4 个） | ❌（2 个） | 共享 Navbar + 日历 |
| link-name | ❌（7 个） | — | QuickNavDock 锚点 |
| heading-order | ❌（1 个） | — | 更新日志 h4 跳级 |
| color-contrast | ❌（3 处） | ❌（4 处） | 见下方清单 |
| aria-input-field-name | — | ❌ | 评论占位框 |
| label | — | ❌ | 评论排序 ElSelect |
| landmark-one-main | — | ❌ | 帖子详情无 main |
| robots-txt | ❌ | ❌ | /robots.txt 被 SPA fallback 返回 HTML |
| llms-txt | ❌ | ❌ | /llms.txt 同上，且文件不存在 |
| agent-accessibility-tree | ❌ | ❌ | 与 button/link-name 同源，修复后连带通过 |

当前分数：首页 A11y 83 / SEO 92 / Agentic Browsing 33；帖子详情 A11y 82 / SEO 92 /
Agentic Browsing 33。

## 2. 修复方案（按文件）

### 静态文件（SEO + Agentic）
- `public/robots.txt`（新建）：`User-agent: *` + `Allow: /`。vite 会把 public/ 原样
  拷入 dist 根，/robots.txt 不再落入 SPA fallback。
- `public/llms.txt`（新建）：按 llmstxt.org 建议——H1 标题 + 站点简介 + 主要路由
  链接（根相对路径，无虚构域名）。

### 共享组件
- `src/components/Navbar.vue`：3 个图标按钮补 aria-label（搜索/用户/菜单）。
- `src/components/QuickNavDock.vue`：7 个锚点补 `:aria-label="link.label"`。

### 首页
- `src/sections/HeroSection.vue`：更新日志条目标题 h4 → h3（修复 h2→h4 跳级；
  class 不变，零视觉变化）。
- `src/components/ActivityCalendar.vue`：
  - 月份切换按钮 aria-label（上个月/下个月）；
  - 无活动日期数字 `text-gray-300`（#d1d5db，对比 1.47）→ `text-gray-500`
    （#6b7280，对比 4.83）——色比审计必然要求的最小视觉增量；
  - ElTag（type=primary 蓝字 #409eff，对比 2.52）→ 文字色覆盖为 #1d4ed8；
    info 态灰字同理 #4b5563（当前渲染态未触达，预防性修复）；
  - ElButton primary（白字 on #409eff，对比 2.78）→ `--el-button-bg-color` 等
    变量覆盖为 #2563eb（白字对比 5.1），hover/active #1d4ed8。

### 帖子详情
- `src/pages/forum-post-detail/Index.vue`：内容容器 div → main（补 main 地标）。
- `src/pages/forum-post-detail/CommentEditor.vue`：占位框（role=textbox）补
  `aria-label="评论内容"` + `aria-multiline="true"`；占位文字 #94a3b8（对比 2.56）
  → #64748b（对比 4.76），编辑器内部占位符同色修正。
- `src/pages/forum-post-detail/CommentSortSelect.vue`：ElSelect 补
  `aria-label="排序方式"`（EP 2.14 支持 ariaLabel prop，落在内部 input 上）。
- `src/pages/forum-post-detail/PostHeader.vue`：分类徽章 emerald-600（对比 3.57）
  → emerald-700（对比 5.1）。
- `src/pages/forum-post-detail/PostContent.vue`：
  - `.code-header` 文字 #64748b（对比 3.86）→ #475569（对比 5.9）；
  - `.hljs-comment` #6a737d（github.css 主题，对比 4.39）→ #57606a（github.com
    现行注释色，对比 5.2）——在组件样式里以更高特异性覆盖。

## 3. 视觉保真声明

aria-label / h4→h3（同 class）/ main 地标 / 静态文件：**零视觉变化**。
色比修复必然改变颜色，按"最小增量到 4.5:1"原则取色，清单见上。不改变任何布局、
尺寸、动画与交互行为。

## 4. 验证方案

1. `npm run check`（lint / type-check / build --manifest / verify-build）。
2. 重建产物后两页重跑 `lighthouse_audit`（desktop, navigation）：
   验收 = 两页 A11y / SEO / Agentic Browsing 全部失败项清零。
3. 功能冒烟：日历月份切换与日期选择、评论占位框激活、排序选择器、
   代码复制按钮、控制台零 error/warning。
4. 独立代理审查改动 diff。
5. 实施记录落盘 `docs/perf-imprv-records/`（M4 记录文档）。

## 5. 已知边界

- robots.txt / llms.txt 在 vite preview 下即可被审计直接验证（无部署依赖）。
- 无虚构生产域名：llms.txt 链接用根相对路径（llmstxt.org 允许）。
- Agentic Browsing 的 agent-accessibility-tree 与 a11y 失败项同源，不单独施工，
  以重审计结果证实。

## 6. 实施后补充（独立审查驱动）

1. **同模式补漏**（审查发现首轮全量排查有遗漏，均为一行改动）：home.ts ticker
   `工具` cyan-600（3.39，位于首屏、marquee 动画使导航审计"运气通过"）、工程
   区块 `行业` emerald-600、论坛区块 `求助` orange-600、market 类型 Skill
   emerald / Subagent orange、情报区块 `政策` rose-600、navigation.ts `情报局`
   rose-600（4.28）与 `AI论坛` cyan-600、PostHeader 分类 amber/rose-600——
   全部 600→700。
2. **heading-order 时序脆弱**：Footer 列标题与 IntelligenceSection 条目标题原为
   h4，懒加载 h2 区块挂载后形成 H2→H4 跳级（导航审计靠"区块未挂载"侥幸通过，
   快照审计实锤失败）——降为 h3。
3. **EP primary 按钮色比修复的复用化**：AgentMarketSection 的活动筛选按钮同样
   白字 on #409eff（2.78）；原 ActivityCalendar 局部类改为全局工具类
   `.a11y-primary-button`（element-overrides.css 双类选择器，规避 EP 运行时
   注入顺序问题），两处共用。
4. **发现的预存在问题**：element-overrides.css 中 `.el-button--primary` 的
   `--home-primary` token 映射因 EP 样式运行时注入晚于该文件而**整体失效**（起测
   审计实测渲染值为 EP 默认 #409eff，非 token 深蓝）——修复该全局映射属跨页
   视觉变更，不在 M4 范围，记录待后续决策。
5. **验证加严**：验收补充"完整渲染态快照审计"（滚动挂载全部 10 区块后
   snapshot 审计），两页 navigation + 首页 snapshot 三场景全部 0 失败。
