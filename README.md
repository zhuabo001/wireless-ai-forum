# wireless-ai-forum

无线AI极客汇 — AI赋能无线研发，连接每一位创新者。

## 目录结构

```
wireless-ai-forum/
├── index.html                          # Vite 入口 HTML
├── vite.config.ts                      # Vite 构建配置（含路径别名 @/）
├── tsconfig.json                       # TypeScript 配置
├── tailwind.config.js                  # Tailwind CSS 配置
├── postcss.config.js                   # PostCSS 配置（Tailwind 插件）
├── auto-imports.d.ts                   # unplugin-auto-import 类型声明
├── env.d.ts                            # Vite 客户端类型增强声明
├── package.json                        # 项目依赖与脚本
├── CLAUDE.md                           # Claude 开发规则
│
├── src/                                # 源代码目录
│   ├── main.ts                         # 应用入口：挂载 Vue/Router/Pinia
│   ├── App.vue                         # 根组件（Navbar + <router-view />）
│   │
│   ├── assets/                         # 静态资源与全局样式
│   │   ├── main.css                    # 全局样式（Tailwind 指令 + 自定义）
│   │   ├── tokens.css                  # CSS 自定义属性（设计令牌）
│   │   └── element-overrides.css       # Element Plus 组件样式覆盖
│   │
│   ├── router/                         # Vue Router 路由配置
│   │   └── index.ts                    # 定义所有路由路径（/、/forum、/courses 等）
│   │
│   ├── store/                          # Pinia 状态管理
│   │   └── index.ts                    # 初始化 Pinia + 持久化插件，对外暴露 pinia 实例
│   │
│   ├── types/                          # TypeScript 类型定义
│   │   ├── home.ts                     # 首页通用类型（NavLink、HeroStat 等）
│   │   └── pageDesign/                 # 页面级类型定义（按页面划分）
│   │       ├── forum.ts                # 论坛页面类型
│   │       ├── forumNewTopic.ts        # 发帖页面类型
│   │       ├── forumPostDetail.ts      # 帖子详情类型
│   │       ├── practices.ts            # 优秀实践页面类型
│   │       ├── toolbox.ts              # 百宝箱页面类型
│   │       ├── courses.ts              # 课程中心类型
│   │       ├── intelligence.ts         # 情报局页面类型
│   │       └── market.ts               # Agent 市场类型
│   │
│   ├── data/                           # Mock 数据层（静态数据 + 配置）
│   │   ├── home.ts                     # 首页所有区块数据（hero/stats/changelog 等）
│   │   ├── navigation.ts               # 导航栏、页脚链接数据
│   │   └── pageDesign/                 # 各页面 Mock 数据
│   │       ├── forum.ts                # 论坛列表、标签、用户数据
│   │       ├── forumNewTopic.ts        # 发帖页面数据
│   │       ├── forumPostDetail.ts      # 帖子详情、评论、回帖数据
│   │       ├── practices.ts            # 实践卡片、贡献者数据
│   │       ├── toolbox.ts              # 百宝箱文章列表数据
│   │       ├── courses.ts              # 课程数据
│   │       ├── intelligence.ts         # 情报局新闻数据
│   │       └── market.ts               # Agent 市场商品数据
│   │
│   ├── composables/                    # Vue 组合式函数
│   │   └── useScrollReveal.ts          # 滚动进入视口动画 hook
│   │
│   ├── components/                     # 通用 UI 组件
│   │   ├── Navbar.vue                  # 顶部导航栏
│   │   ├── QuickNavDock.vue            # 首页快速导航侧边栏
│   │   ├── ShinyText.vue               # 光泽渐变文字特效
│   │   ├── GlitchText.vue              # 故障抖动文字特效
│   │   ├── BeamsBackground.vue         # Luminous 射线背景
│   │   ├── MarqueeCarousel.vue         # 跑马灯信息流
│   │   ├── ActivityCalendar.vue        # 社区活动日历（可点击日期查看活动）
│   │   ├── ImageModal.vue              # 图片放大模态框
│   │   ├── layout/                     # 布局组件
│   │   │   ├── HomeLayout.vue          # 首页布局容器
│   │   │   ├── HomeSection.vue         # 区块通用包裹容器
│   │   │   └── SectionHeader.vue       # 区块标题头（title + link）
│   │   └── ui/                         # 小型原子化 UI 组件
│   │       ├── BaseCard.vue            # 通用卡片容器
│   │       ├── IconRenderer.vue        # Lucide 图标渲染器（自动按名匹配）
│   │       ├── TagBadge.vue            # 标签徽章
│   │       ├── MetricCard.vue          # 统计指标卡片
│   │       ├── MediaCard.vue           # 图文媒体卡片
│   │       ├── ImagePreview.vue        # 图片缩略图 + 预览
│   │       └── TopicList.vue           # 话题列表（通用复用）
│   │
│   ├── sections/                       # 首页各区块（≈ 页面区域组件）
│   │   ├── HeroSection.vue             # 首屏 Hero（标题/按钮/日历/统计/更新日志）
│   │   ├── EngineeringSection.vue      # 工程能力展示区
│   │   ├── PracticesSection.vue        # 优秀实践缩略展示
│   │   ├── ToolboxSection.vue          # 百宝箱缩略展示
│   │   ├── IntelligenceSection.vue     # 情报局新闻速递
│   │   ├── CoursesSection.vue          # 课程中心缩略展示
│   │   ├── AtmosphereSection.vue       # 社区氛围建设活动展示
│   │   ├── ForumSection.vue            # 论坛热门话题缩略
│   │   ├── AgentMarketSection.vue      # Agent 市场缩略展示
│   │   └── Footer.vue                  # 页脚
│   │
│   └── pages/                          # 独立页面组件
│       ├── HomePage.vue                # 首页入口（组合所有 sections）
│       │
│       ├── forum/                      # 论坛页
│       │   ├── Index.vue               # 论坛入口（组合子组件）
│       │   ├── ForumToolbar.vue        # 工具栏（筛选/排序/发帖按钮）
│       │   ├── ForumTopicList.vue      # 话题列表容器
│       │   ├── ForumTopicItem.vue      # 单条话题行（点击跳转详情）
│       │   ├── ForumSidebar.vue        # 右侧面板（热门/活跃/公告）
│       │   ├── ForumPagination.vue     # 分页器
│       │   ├── HotTopicRank.vue        # 热门话题排行榜
│       │   ├── HotTagCloud.vue         # 热门标签云
│       │   ├── ActiveUserList.vue      # 活跃用户列表
│       │   └── CommunityRules.vue      # 社区规则公告
│       │
│       ├── forum-new-topic/            # 发帖页
│       │   ├── Index.vue               # 发帖入口（组合子组件）
│       │   ├── NewTopicBreadcrumb.vue  # 面包屑导航
│       │   ├── TopicTitleField.vue     # 标题输入
│       │   ├── TopicCategorySelect.vue # 分类选择（ElSelect）
│       │   ├── TopicSummaryField.vue   # 摘要/简介输入
│       │   ├── TopicTagPicker.vue      # 标签选择
│       │   ├── EditorModeSwitch.vue    # 编辑器模式切换（富文本/Markdown）
│       │   ├── RichTextEditor.vue      # wangEditor 富文本编辑器
│       │   ├── MarkdownEditor.vue      # md-editor-v3 Markdown 编辑器
│       │   ├── CoverUploader.vue       # 封面图片上传
│       │   └── PublishActions.vue      # 发布/保存草稿按钮
│       │
│       ├── forum-post-detail/          # 帖子详情页
│       │   ├── Index.vue               # 详情入口（状态管理 + 子组件组合）
│       │   ├── PostHeader.vue          # 顶部：返回按钮/分类/标题/作者/统计
│       │   ├── PostContent.vue         # 正文渲染（段落/标题/列表/代码/引用/表格）
│       │   ├── PostResourceLinks.vue   # 资源链接区
│       │   ├── PostFloatingActions.vue # 桌面端浮动操作栏（点赞/收藏/评论跳转）
│       │   ├── PostMobileActions.vue   # 移动端底部操作栏
│       │   ├── CommentSection.vue      # 评论区容器
│       │   ├── CommentSortSelect.vue   # 评论排序选择器（ElSelect）
│       │   ├── CommentEditor.vue       # 主评论编辑器（wangEditor）
│       │   ├── CommentList.vue         # 评论列表 + 加载更多
│       │   └── CommentItem.vue         # 单条评论（含嵌套回复编辑器）
│       │
│       ├── practices/                  # 优秀实践页
│       │   ├── Index.vue               # 实践入口
│       │   ├── PracticeCard.vue        # 实践卡片（点击跳转帖子详情）
│       │   ├── PracticeList.vue        # 实践列表容器
│       │   ├── PracticeToolbar.vue     # 搜索/排序/筛选工具栏
│       │   ├── PracticeCategorySidebar.vue  # 分类侧边栏
│       │   ├── PracticeSidebar.vue     # 右侧面板（热门/贡献者/团队）
│       │   ├── HotPostList.vue         # 热门实践列表
│       │   ├── ContributorList.vue     # 贡献者排名
│       │   ├── TeamList.vue            # 团队列表
│       │
│       ├── toolbox/                    # 百宝箱页
│       │   ├── Index.vue               # 百宝箱入口
│       │   ├── ToolArticleItem.vue     # 文章卡片（点击跳转帖子详情）
│       │   ├── ToolArticleList.vue     # 文章列表容器
│       │   ├── ToolCategorySidebar.vue # 分类侧边栏
│       │   ├── ToolboxSearchBar.vue    # 搜索栏
│       │   └── ToolboxPagination.vue   # 分页器
│       │
│       ├── courses/                    # 课程中心页
│       │   ├── Index.vue               # 课程入口
│       │   ├── CourseCard.vue          # 课程卡片
│       │   ├── CourseGrid.vue          # 课程网格布局
│       │   ├── CourseCategorySidebar.vue  # 分类侧边栏
│       │   └── CoursePagination.vue    # 分页器
│       │
│       ├── intelligence/               # 情报局页
│       │   ├── Index.vue               # 情报入口
│       │   ├── IntelligenceCard.vue    # 情报卡片
│       │   ├── IntelligenceList.vue    # 情报列表
│       │   ├── IntelligenceSearch.vue  # 搜索栏
│       │   └── IntelligenceSidebar.vue # 右侧面板（分类/热门标签/来源）
│       │
│       └── market/                     # Agent 市场页
│           ├── Index.vue               # 市场入口
│           ├── FeaturedAgents.vue      # 精选 Agent 轮播
│           ├── AgentCard.vue           # Agent 商品卡片
│           ├── MarketToolbar.vue       # 分类标签切换 + 排序
│           └── MarketSidebar.vue       # 右侧面板（推荐/新上架/统计排行）
│
├── page-design/                        # HTML 设计稿（原始设计参考）
│
├── docs/                               # 开发计划文档
│
└── records/                            # 开发记录与变更摘要
```

## 路由一览

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 多区块 Landing Page（Hero / 工程能力 / 实践 / 百宝箱 / 情报 / 课程 / 论坛 / Agent 市场） |
| `/forum` | 论坛 | 话题列表、排序筛选、侧边栏 |
| `/forum/new-topic` | 发帖 | 富文本/Markdown 双模式编辑器、标签选择、封面上传 |
| `/forum/post/:id` | 帖子详情 | 文章渲染、点赞/收藏、评论系统 |
| `/practices` | 优秀实践 | 实践卡片网格（点击跳转帖子详情）、分类筛选 |
| `/toolbox` | 百宝箱 | 工具文章列表（点击跳转帖子详情）、搜索分页 |
| `/courses` | 课程中心 | 课程卡片网格、分类筛选、分页 |
| `/intelligence` | 情报局 | AI 新闻资讯列表、搜索筛选 |
| `/market` | Agent 市场 | 精选 Agent 轮播、商品卡片 |

## 依赖清单

| 依赖 | 类型 | 用途 |
|------|------|------|
| **vue** ^3.5 | 运行时 | 前端框架（Composition API + `<script setup>`） |
| **vue-router** ^5.0 | 运行时 | 前端路由（`createWebHistory`） |
| **pinia** ^3.0 | 运行时 | 全局状态管理（用户 Store 等） |
| **element-plus** ^2.14 | 运行时 | UI 组件库（ElSelect、ElMessage 等） |
| **@element-plus/icons-vue** ^2.3 | 运行时 | Element Plus 图标集合 |
| **@wangeditor/editor** ^5.1 | 运行时 | 富文本编辑器内核（wangEditor 5） |
| **@wangeditor/editor-for-vue** ^5.1 | 运行时 | wangEditor Vue 3 封装组件 |
| **md-editor-v3** ^6.5 | 运行时 | Markdown 编辑器（发帖可选模式） |
| **pinia-plugin-persistedstate** latest | 运行时 | Pinia 状态持久化（自动存 localStorage） |
| **gsap** ^3.12 | 运行时 | GreenSock 动画库（滚动动画、文字特效） |
| **vite** ^8.0 | 开发 | 构建工具（HMR、TS 编译、CSS 处理） |
| **@vitejs/plugin-vue** ^6.0 | 开发 | Vite Vue 3 SFC 编译插件 |
| **vue-tsc** ^3.2 | 开发 | Vue TypeScript 类型检查 |
| **typescript** ~6.0 | 开发 | 类型系统与编译 |
| **tailwindcss** ^3.4 | 开发 | 原子化 CSS 框架 |
| **postcss** ^8.5 | 开发 | CSS 后处理器（Tailwind 底层依赖） |
| **autoprefixer** ^10.4 | 开发 | CSS 前缀自动补充 |
| **sass** ^1.100 | 开发 | SCSS 编译器（组件 `<style lang="scss">`） |
| **unplugin-auto-import** ^21.0 | 开发 | 自动导入 Vue/Router/Pinia API |

## 开发

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview
```
