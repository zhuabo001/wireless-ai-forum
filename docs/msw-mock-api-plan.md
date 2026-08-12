# MSW 模拟接口接入计划

## 背景

当前页面数据由 `src/data/` 静态模拟数据直接 import 驱动。为模拟真实后端交互、
为后续接口联调铺路，引入 MSW（Mock Service Worker）在 Vite dev 环境提供一批
RESTful 风格的模拟接口，数据复用现有 `src/data/` 导出。

## 范围

- 仅 dev 环境启用，通过 `VITE_ENABLE_MSW=true` 显式开启（opt-in），生产构建不受影响。
- 提供只读 GET 接口为主（列表 + 详情 + 基础 query 过滤/分页）。
- 页面组件本次不改造为远程取数（保持现有 import 方式），接口作为独立基础设施交付。
- 不做写接口（POST/PUT/DELETE），后续接发帖等写流程时再补。

## 里程碑

1. **依赖与 worker 初始化**：安装 `msw`，生成 `public/mockServiceWorker.js`。
2. **mocks 目录与 handlers**：`src/mocks/` 下按域拆分 handlers
   （forum / courses / intelligence / practices / market / toolbox / home），
   统一 `/api` 前缀，列表接口支持 category/keyword/page/pageSize 等基础 query。
3. **API client**：`src/api/` 提供带类型的 fetch 封装与各域 endpoint 函数，
   复用 `src/types/` 领域类型。
4. **启动接入**：`main.ts` 在 `DEV && VITE_ENABLE_MSW` 时异步启动 worker 后再挂载；
   `.env.development` 默认开启。
5. **验证**：`npm run check` 通过；dev 环境浏览器实测至少 3 个接口返回正确数据。

## 接口草案

| 方法 | 路径 | 数据来源 |
| --- | --- | --- |
| GET | /api/home、/api/navigation | data/home.ts、data/navigation.ts 聚合 |
| GET | /api/forum/topics、/api/forum/stats、/api/forum/meta | data/home.ts、data/pageDesign/forum.ts |
| GET | /api/forum/posts/:id、/api/forum/posts/:id/comments | data/pageDesign/forumPostDetail.ts |
| GET | /api/courses、/api/courses/meta | data/pageDesign/courses.ts |
| GET | /api/intelligence、/api/intelligence/meta | data/pageDesign/intelligence.ts |
| GET | /api/practices、/api/practices/meta | data/pageDesign/practices.ts |
| GET | /api/market/agents、/api/market/meta | data/pageDesign/market.ts |
| GET | /api/toolbox/articles、/api/toolbox/meta | data/pageDesign/toolbox.ts |

约定：

- 列表接口统一支持 `keyword`/`page`/`pageSize`；分类过滤参数沿用各域字段名
  （`categoryId`/`type`/`tab` 等），排序参数 `sort` 的取值以对应 meta 接口广告为准。
- 各域 `meta` 接口聚合页面元信息（分类、筛选项、侧栏等），减少首屏请求数。
- 论坛 `tab`/`category`/`sort` 取值与 `/api/forum/meta` 广告的 `tabs`、
  `categoryFilters`、`sortFilters` 一致。

## 验证方式

- `npm run check`（lint + type-check + build）。
- 启动 `npm run dev`，浏览器内 fetch 上述接口核对响应结构与数据。
