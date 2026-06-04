# 首页改造拆分方案

## 当前结构判断

`src/App.vue` 现在已经把首页拆成了多个 section，但它仍然只是“页面装配器”：导入背景、导航、快捷 dock、9 个 section 和 footer，然后逐个写死渲染。问题不在于完全没组件，而在于：

1. section 注册是硬编码的，`App.vue` 里每个 `<section id="...">` 手写一遍。
2. `HeroSection` 内部又有 `<section id="hero">`，和 `App.vue` 的 `id="hero"` 重复。
3. 数据散落在各个 SFC 顶部，例如 `HeroSection.vue`、`ForumSection.vue`。
4. 视觉样式几乎全靠 Tailwind utility class，后续内网不可用时维护成本高。
5. lucide 图标作为组件对象塞进数据里，数据结构和 UI 库强耦合。

## 建议的改造目标

第一阶段只改首页，不做重设计。核心目标是“保留当前视觉”，同时把页面变成数据驱动、组件化、可离线构建。

建议落地结构：

```text
src/
  data/
    home.ts              # 首页所有静态结构化数据
    navigation.ts        # 顶部导航、右侧 dock、footer 链接
  types/
    home.ts              # Section、Card、Course、Topic 等类型
  components/
    layout/
      HomeLayout.vue
      HomeSection.vue
      SectionHeader.vue
    ui/
      BaseCard.vue
      MetricCard.vue
      TagBadge.vue
      IconRenderer.vue
      ImagePreview.vue
  sections/
    HeroSection.vue
    EngineeringSection.vue
    ...
```

`App.vue` 最终应只负责：

```vue
<HomeLayout>
  <HomeSection
    v-for="section in homeSections"
    :key="section.id"
    :id="section.id"
    :component="section.component"
  />
</HomeLayout>
```

不要再把标题、文案、列表项直接写在 template 里。

## 适合用 Element Plus 替换的部分

这些地方用组件库收益高，且能通过样式覆盖保留当前设计：

1. `ActivityCalendar`

   当前 `ActivityCalendar.vue` 手写了活动数据、月份切换、日期网格、详情卡。可以用 `ElCalendar` 承接日期网格，用 `ElCard`、`ElTag`、`ElButton` 承接详情区域。注意需要强改 Element Plus 的日历格子高度、选中态、禁用态，否则会变成后台系统味道。

2. `ImageModal`

   当前 `ImageModal.vue` 自己做 Teleport、遮罩、esc 关闭、body 滚动锁。可以替换为 `ElDialog` 或 `ElImage` preview。这个替换风险低。

3. `AgentMarketSection`

   分类按钮可以换成 `ElSegmented` 或 `ElRadioGroup`，市场卡片内部用 `ElTag`、`ElRate`、`ElButton`。但卡片本体建议保留自定义 `BaseCard`，不要直接套默认 `ElCard`，否则圆角、阴影、间距会变。

4. `ForumSection`

   `ForumSection.vue` 的统计卡可抽为 `MetricCard`，话题列表可以用 `ElTable` 或自定义 `TopicList`。如果首页只是展示推荐话题，建议自定义列表优先；如果后续论坛页要排序、筛选、分页，再上 `ElTable`。

5. 表单/按钮/标签类控件

   CTA、筛选、报名按钮、状态标签可以统一换成 `ElButton`、`ElTag`，再用 CSS variables 覆盖成当前的蓝色、浅灰边框、8-12px 圆角风格。

## 不建议用 Element Plus 替换的部分

这些是当前设计识别度的来源，替换会伤害视觉目标：

1. `BeamsBackground`

   `BeamsBackground.vue` 是定制 canvas 背景，不应组件库化。最多加 `prefers-reduced-motion` 和可配置参数。

2. Hero 主视觉

   `HeroSection.vue` 的标题、跑马灯、统计卡组合决定首屏观感。可以抽组件和数据，但不要直接换成 Element Plus marketing hero。

3. `MarqueeCarousel`

   跑马灯是定制内容流，适合抽成 `TickerRail`、`TickerItem`，不适合用组件库替代。

4. 课程、活动图片卡

   `CoursesSection`、`AtmosphereSection` 的图片比例、hover scale、标签位置是设计的一部分。可以抽 `MediaCard`，但不建议默认 `ElCard`。

5. 顶部导航整体

   `Navbar` 的透明到毛玻璃状态切换适合保留。可以用 `ElButton`、`ElIcon` 替换右侧按钮，但不建议用 `ElMenu` 重写整个导航。

## 依赖策略

Element Plus 仍然是三方依赖。既然同事内网不能访问公网，方案上必须二选一：

1. 通过公司内网 npm 源安装并锁版本。
2. 把依赖交付进离线包，例如提交 lockfile、构建产物，或提供内网制品库。

同时建议不要继续把 `lucide-vue-next` 图标组件直接写进业务数据。更稳的是数据里只写：

```ts
icon: 'users'
```

然后由 `IconRenderer.vue` 映射到 Element Plus Icons、本地 SVG，或现有 lucide。这样以后换图标库不动业务数据。

## 推荐实施顺序

1. 先抽 `src/data/home.ts` 和 `src/data/navigation.ts`，不动视觉。
2. 抽 `HomeSection`、`SectionHeader`、`BaseCard`、`TagBadge`、`MetricCard`。
3. 改 `App.vue` 为数据驱动 section 注册，解决重复 `id`。
4. 引入 Element Plus，只替换低风险控件：按钮、标签、弹窗、日历。
5. 最后处理 Tailwind：保留短期可用，但把核心视觉 tokens 迁到 `main.css` 或组件 scoped CSS，减少 utility class 扩散。

优先级上，第一轮不要追求“全部 Element Plus 化”。首页的工程化重点应该是数据结构、组件边界、样式 token 和离线依赖治理；组件库只用于标准交互控件，避免破坏当前设计。
