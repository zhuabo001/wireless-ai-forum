# 首页改造执行计划

如果按 `index-redesign-split.md` 的方案真正实现首页改造，执行顺序应该是“先不动视觉，再逐步替换标准控件”，避免一上来引入 Element Plus 导致首页风格跑偏。

## 1. 建立首页数据层

新增：

- `src/types/home.ts`
- `src/data/home.ts`
- `src/data/navigation.ts`

把 `HeroSection`、`Navbar`、`QuickNavDock`、`Footer`、各 section 里的静态数组迁进去。

图标字段不再存 lucide 组件对象，而是改成字符串，例如：

```ts
icon: 'users'
icon: 'book-open'
```

## 2. 抽通用基础组件

新增一组低侵入组件：

- `src/components/layout/HomeLayout.vue`
- `src/components/layout/HomeSection.vue`
- `src/components/layout/SectionHeader.vue`
- `src/components/ui/BaseCard.vue`
- `src/components/ui/MetricCard.vue`
- `src/components/ui/TagBadge.vue`
- `src/components/ui/IconRenderer.vue`

这一步只迁结构和样式复用，不改变页面观感。

## 3. 改造 `App.vue`

把现在手写的 9 个 `<section>` 改成数据驱动渲染：

- section 顺序来自 `homeSections`
- 每个 section 的 `id` 只保留一层，解决 `hero`、`engineering` 等重复 id
- `Navbar`、`QuickNavDock`、`Footer` 读取结构化导航数据

## 4. 逐个 section 重构

建议按下面顺序推进：

1. `HeroSection`

   首屏是首页入口，风险最高。保留 `BeamsBackground`、`ShinyText`、`MarqueeCarousel` 当前视觉，只把数据和可复用结构拆出来。

2. `EngineeringSection`

   抽图片预览和能力卡。

3. `PracticesSection`、`ToolboxSection`、`IntelligenceSection`

   用统一卡片、标签、图标渲染。

4. `CoursesSection`、`AtmosphereSection`

   抽 `MediaCard`，保留图片比例和 hover。

5. `ForumSection`

   抽 `MetricCard` 和 `TopicList`。

6. `AgentMarketSection`

   抽筛选状态和市场卡片。

## 5. 引入 Element Plus 的最小替换

这一步需要先确认内网依赖策略。如果有内网 npm 源，安装：

- `element-plus`
- `@element-plus/icons-vue`

先只替换：

- `ImageModal` -> `ElDialog` 或 `ElImage` preview
- 活动报名按钮、筛选按钮、标签 -> `ElButton` / `ElTag`
- `ActivityCalendar` 日期网格 -> 评估后用 `ElCalendar`，但必须强定制样式

不使用 Element Plus 重写整个首页布局。

## 6. 样式工程化

新增或整理：

- `src/assets/tokens.css`
- `src/assets/element-overrides.css`

把高频 Tailwind 组合沉淀成 class 或 CSS variables，比如：

- 页面最大宽度
- section 间距
- 卡片边框、圆角、阴影
- 主色、muted 文本、tag 色板
- Element Plus 主题变量覆盖

## 7. 处理图标依赖

做 `IconRenderer.vue`：

- 第一阶段可以继续映射到 `lucide-vue-next`
- 如果要彻底摆脱 lucide，就切到 `@element-plus/icons-vue` 或本地 SVG map
- 业务数据不再感知具体图标库

## 8. 验证

每个阶段后跑：

```bash
npm run build
npm run dev
```

然后用浏览器检查：

- 首屏视觉是否保持一致
- mobile 下导航、卡片、日历是否不溢出
- 锚点跳转是否正常
- 弹窗、筛选、日期选择是否可交互
- Tailwind 和 Element Plus 样式是否冲突

## 明确不做

第一轮不要直接删除 Tailwind，也不要把所有卡片强行换成 `ElCard`。这两个动作都会让页面设计变味。

第一轮目标是结构化、组件化、可维护；组件库只替换标准交互控件。
