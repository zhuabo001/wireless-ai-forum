# Vite Code Splitting 重构方案

## 背景

当前 `vite.config.ts` 已通过 `modulePreload.resolveDependencies` 控制了预加载策略，但分包粒度不够细。所有 `node_modules` 依赖全部打进入口 chunk（363KB JS + 399KB CSS），导致首页首次加载较大，且修改业务代码会导致所有依赖缓存失效。

## 目标

1. **node_modules 依赖**：每个依赖单独拆成一个 chunk，利用浏览器缓存（依赖版本不变则 chunk hash 不变）
2. **src 业务代码**：通过路由动态 import 进行分包（已有，保持不变）
3. **modulePreload**：配合 codeSplitting 调整，确保预加载策略仍正确

## 方案

### 1. codeSplitting 分组策略

按优先级（priority）从高到低匹配，模块命中最先匹配的组：

| 优先级 | 组名 | 匹配规则 | 说明 |
|--------|------|----------|------|
| 60 | `vendor-vue` | vue / vue-router / @vue / pinia / @vueuse | 框架核心，所有页面共用 |
| 50 | `vendor-element-plus` | element-plus / @element-plus | UI 组件库（~800KB style） |
| 50 | `vendor-mermaid` | mermaid | 图表渲染核心（~678KB parser） |
| 50 | `vendor-cytoscape` | cytoscape | 图表布局引擎（~435KB） |
| 50 | `vendor-katex` | katex | 数学公式渲染（~258KB） |
| 50 | `vendor-wangeditor` | @wangeditor | 富文本编辑器（论坛发帖页） |
| 40 | `vendor-md-editor` | md-editor-v3 | Markdown 编辑器 |
| 40 | `vendor-gsap` | gsap | 动画库 |
| 40 | `vendor-lucide` | lucide-vue-next | 图标库 |
| 20 | `vendor-common` | node_modules（其余） | 其他小依赖合并，minSize=20KB |

### 2. modulePreload 适配

当前 `resolveDependencies` 不需要修改：
- `hostType === 'html'`：入口依赖所有 vendor chunks（vue/element-plus 等首页需要的），正常预加载
- `hostType === 'js'`：动态 import 只预加载 CSS，vendor JS 不预加载（首页已缓存）

### 3. 修改文件

仅修改 `vite.config.ts`，在现有 `build.modulePreload` 同级添加 `build.rolldownOptions.output.codeSplitting`。

## 预期效果

| 指标 | 优化前 | 优化后 |
|------|--------|--------|
| 入口 JS 大小 | 363KB（含 vue/element-plus） | 显著减小（vendor 拆出独立 chunk） |
| 入口 CSS 大小 | 399KB（含 element-plus 样式） | 减小（element-plus 样式独立） |
| vendor chunk 数量 | 0 | ~10 个 |
| 缓存策略 | 改一行代码 → 入口 hash 变 | vendor 不变则 hash 不变，命中缓存 |
| 首页 HTTP 请求 | 2（1 JS + 1 CSS） | 增加（vendor chunks 需并行加载），但总体积不变 |
| 非首页加载 | 动态 import 时拉取 | 不变（CSS 预加载，JS 按需） |

## 验收标准

1. `npm run build` 构建成功，无报错
2. 构建产物中可识别出独立的 vendor-*.js chunk
3. 入口 JS 体积显著减小
4. 浏览器缓存友好：仅改业务代码时 vendor chunk hash 不变
5. 首页加载正常，非首页按需加载正常
