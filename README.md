# wireless-ai-forum

无线AI极客汇 — AI赋能无线研发，连接每一位创新者。

Vue 3 单页社区应用（无真实后端）：页面由类型化领域模型 + mock 数据/接口驱动。dev 环境由 **MSW**
拦截 `/api/*` 返回模拟数据；挑战英雄榜模块试点接入 **vue-query** 做接口级缓存（其余模块仍走裸
`api/` 调用）。质量门禁含 **vitest** 契约测试（node 环境复用同一套 MSW handlers）与构建产物守卫。

## 目录结构

```
wireless-ai-forum/
├── index.html                          # Vite 入口 HTML
├── vite.config.ts                      # Vite 构建配置（分包/预加载策略）
├── vitest.config.ts                    # vitest 独立配置（node 环境、零插件、@ alias）
├── tsconfig.json / eslint.config.js    # TS / ESLint 配置
├── tailwind.config.js / postcss.config.js
├── auto-imports.d.ts / components.d.ts # unplugin-auto-import / -components 类型声明
├── vue-doctor.config.json              # vue-doctor 体检配置
├── package.json                        # 依赖与脚本（check = lint+type-check+test+build+verify-build）
├── CLAUDE.md / AGENTS.md / PRODUCT.md  # 项目指南与说明
│
├── page-design/                        # HTML 设计稿（原始设计参考）
├── public/                             # 静态资源 + mockServiceWorker.js + robots/llms.txt
├── scripts/verify-build.mjs            # 构建守卫：深链资源与懒加载 vendor 边界校验
├── tests/                              # Playwright 用例素材
├── docs/                               # 计划与治理（plans/ 进度、reports/ 体检、perf-imprv-records/、
│                                       #   todo/ 评估待办、contracts/ 契约等，详见 CLAUDE.md 关键路径）
└── records/                            # 已交付任务的最终记录
```

### src/

```
src/
├── main.ts                     # 入口：MSW 注册（VITE_ENABLE_MSW=true 时）→ router.isReady → pinia → VueQueryPlugin
├── App.vue                     # 根组件（Navbar + <router-view />）
│
├── api/                        # 接口层（fetch 封装 + 各模块 API）
│   ├── http.ts                 #   fetch 封装（base origin、ApiError 归一化）
│   ├── index.ts                #   统一出口
│   ├── challenges.ts           #   挑战英雄榜 API（4 查询 + 5 变更）
│   ├── queryClient.ts          #   vue-query QueryClient 单例（staleTime 30s / 4xx 短路重试）
│   ├── challengeKeys.ts        #   queryKey 工厂（role 入 detail key，前缀支持分层失效）
│   ├── forum.ts / home.ts / courses.ts / …   # 其余模块 API
│   └── __tests__/              # vitest：查询契约 + 状态机契约 + vue-query 集成（共 56 例）
│
├── mocks/                      # MSW mock（dev 专用，拦截 /api/*）
│   ├── browser.ts              #   worker 启动
│   └── handlers/               #   每模块一份 handler（与 api/ 一一对应）+ utils
│
├── test/                       # vitest node 环境
│   ├── setup.ts                #   window/location stub + MSW server 生命周期
│   └── server.ts               #   setupServer（复用 handlers）+ createTestChallenge/countRequests 助手
│
├── composables/                # 组合式函数
│   └── useChallenges.ts        #   挑战模块 vue-query hooks（4 查询 + 5 变更；mutation 成功统一 invalidate）
│
├── assets/                     # 全局样式与设计令牌
│   ├── main.css                #   Tailwind 指令 + 自定义
│   ├── tokens.css              #   CSS 自定义属性（设计令牌）
│   └── element-overrides.css   #   Element Plus 组件样式覆盖
│
├── router/index.ts             # 路由（除首页外全部懒加载，含 scrollBehavior）
│
├── store/index.ts              # Pinia 初始化 + 持久化插件
│
├── types/                      # 共享与页面级类型
│   ├── api.ts                  #   接口通用类型（PagedResult/PageQuery）
│   ├── home.ts                 #   首页通用类型
│   └── pageDesign/             #   页面级类型（forum、challengeHeroes、courses …）
│
├── data/                       # Mock 数据层
│   ├── home.ts / navigation.ts
│   └── pageDesign/             #   各页面 mock 数据（与 types/pageDesign 一一对应）
│
├── utils/                      # 共享逻辑
│   ├── markdown.ts             #   帖子渲染管线（markdown-it + hljs 按需注册 14 语言 + mermaid）
│   └── challenges.ts           #   难题状态 → 徽章文案/配色映射（列表页、详情页共用）
│
├── components/                 # 跨页面共享组件
│   ├── Navbar.vue / Pagination.vue / ShinyText.vue / MarqueeCarousel.vue …
│   ├── PostContent.vue         #   帖子正文渲染（段落/代码/表格…）
│   ├── RichTextEditor.vue      #   wangEditor 富文本编辑器
│   ├── ActivityCalendar.vue / ImageModal.vue / BeamsBackground.vue
│   ├── comments/               #   评论区（CommentSection/List/Item/Editor/SortSelect）
│   ├── layout/                 #   HomeLayout / HomeSection（IntersectionObserver 懒挂载壳）/ SectionHeader
│   └── ui/                     #   原子化 UI（BaseCard、IconRenderer(lucide)、TagBadge、RoadMapCard …）
│
├── sections/                   # 首页区块（折叠线下区块懒加载：进入视口前 400px 才挂载）
│   ├── HeroSection.vue         #   首屏（静态；LCP 所在区块）
│   └── Engineering / Practices / Toolbox / Intelligence / Courses / Atmosphere /
│       Forum / RoadMap / AgentMarket / Footer 等区块
│
└── pages/                      # 路由页面（除首页外全部懒加载）
    ├── HomePage.vue            #   首页入口（组合全部 sections）
    ├── challenges/             #   挑战英雄榜：列表（Toolbar/List/Item/Sidebar；筛选/排序/分页，vue-query）
    ├── challenge-new/          #   发布难题（表单；meta 与列表页共享缓存）
    ├── challenge-detail/       #   详情（Header/FloatingActions/RoleSwitcher/Score/Progress/
    │                           #   CancelClaim 弹窗；操作后以服务端响应为准自动刷新）
    ├── forum/                  #   论坛列表（Toolbar/TopicList/Item/Sidebar/分页/热门榜/标签云）
    ├── forum-new-topic/        #   发帖（双模式编辑器：wangEditor 富文本 / vditor Markdown、标签、封面上传）
    ├── forum-post-detail/      #   帖子详情（Header/ResourceLinks/浮动与移动端操作栏；评论见 components/comments）
    ├── practices/              #   优秀实践（卡片网格、分类、贡献者榜）
    ├── toolbox/                #   百宝箱（文章列表、搜索分页）
    ├── courses/                #   课程中心（卡片网格、分类、分页）
    ├── intelligence/           #   情报局（新闻列表、搜索筛选）
    └── market/                 #   Agent 市场（精选轮播、商品卡片）
```

## 路由一览

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 多区块 Landing Page（Hero / 工程能力 / 实践 / 百宝箱 / 情报 / 课程 / 论坛 / 路线图 / Agent 市场） |
| `/forum` | 论坛 | 话题列表、排序筛选、侧边栏 |
| `/forum/new-topic` | 发帖 | 富文本/Markdown 双模式编辑器、标签选择、封面上传 |
| `/forum/post/:id` | 帖子详情 | 文章渲染、点赞/收藏、评论系统 |
| `/practices` | 优秀实践 | 实践卡片网格（点击跳转帖子详情）、分类筛选 |
| `/toolbox` | 百宝箱 | 工具文章列表（点击跳转帖子详情）、搜索分页 |
| `/courses` | 课程中心 | 课程卡片网格、分类筛选、分页 |
| `/intelligence` | 情报局 | AI 新闻资讯列表、搜索筛选 |
| `/market` | Agent 市场 | 精选 Agent 轮播、商品卡片 |
| `/challenges` | 挑战英雄榜 | 难题列表：tab（全部/我发布/我揭榜）/部门/日期/关键词/排序/分页；vue-query 缓存 + 筛选变更自动重取 |
| `/challenges/new` | 发布难题 | 发布表单；成功后失效列表缓存并跳转详情 |
| `/challenges/:id` | 难题详情 | 揭榜/取消揭榜/进度更新/评分（mock 接口）；操作后自动重取、状态以服务端响应为准；角色切换视角 |

## 依赖清单

| 依赖 | 类型 | 用途 |
|------|------|------|
| **vue** ^3.5 | 运行时 | 前端框架（Composition API + `<script setup>`） |
| **vue-router** ^5.0 | 运行时 | 前端路由（`createWebHistory`，路由级懒加载） |
| **pinia** ^3.0 | 运行时 | 全局状态管理 |
| **pinia-plugin-persistedstate** ^4.7 | 运行时 | Pinia 状态持久化（localStorage） |
| **element-plus** ^2.14 | 运行时 | UI 组件库（按需自动引入） |
| **@tanstack/vue-query** ^5.102 | 运行时 | 接口级缓存与失效联动（挑战英雄榜试点，评估见 `docs/todo/tanstack-vue-usage.md`） |
| **lucide-vue-next** | 运行时 | 图标库（IconRenderer 按名匹配） |
| **markdown-it** ^14.3 | 运行时 | Markdown 解析（帖子正文） |
| **highlight.js** ^11.11 | 运行时 | 代码高亮（`lib/core` 按需注册 14 种语言） |
| **mermaid** ^11.16 | 运行时 | 图表渲染（帖子 Markdown 围栏） |
| **vditor** ^3.11 | 运行时 | Markdown 编辑器（发帖可选模式） |
| **@wangeditor/editor**（+for-vue）^5.1 | 运行时 | wangEditor 5 富文本编辑器（发帖与评论） |
| **vite** ^8.0 | 开发 | 构建工具（rolldown 内核，分包/预加载定制见 `vite.config.ts`） |
| **@vitejs/plugin-vue** ^6.0 | 开发 | Vue 3 SFC 编译插件 |
| **typescript** ~6.0 / **vue-tsc** ^3.2 | 开发 | 类型系统与 `vue-tsc --noEmit` 检查 |
| **eslint** ^9 + **eslint-plugin-vue** + **typescript-eslint** | 开发 | 代码检查（`--max-warnings=0`） |
| **vitest** ^5.0 | 开发 | 测试 runner（独立 node 配置，跑在 MSW `setupServer` 之上） |
| **msw** ^2.15 | 开发 | mock 服务端（dev browser worker + 测试 node server 复用同一组 handlers） |
| **tailwindcss** ^3.4 + postcss + autoprefixer | 开发 | 原子化 CSS |
| **sass** ^1.100 | 开发 | SCSS 编译器 |
| **unplugin-auto-import** ^21 / **unplugin-vue-components** ^32 | 开发 | Vue/Router/Pinia API 与组件自动引入 |
| **vite-plugin-static-copy** ^4.1 | 开发 | 构建期静态资源拷贝 |
| **vue-doctor** | 开发 | Vue 项目体检 |

## 开发

```bash
# 启动开发服务器（演示需开启 MSW：拦截 /api/* 返回 mock 数据；
# 不带该变量时依赖 /api 的页面将请求真实后端）
VITE_ENABLE_MSW=true npm run dev

# 测试（vitest：查询/状态机契约 + vue-query 集成，node 环境复用 MSW handlers）
npm run test
npm run test:watch

# 单项检查
npm run lint        # ESLint（零告警）
npm run type-check  # vue-tsc
npm run verify-build# 构建产物守卫（深链资源 + 懒加载 vendor 边界）

# 全量质量门禁（lint + type-check + test + build + verify-build）
npm run check
```
