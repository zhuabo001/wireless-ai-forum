# Vite 打包优化方案

## 目标

1. preload 的产物限制为首页相关的内容
2. 其他 chunk 只有在对应页面使用到的时候才拉取加载

## 背景

当前项目路由已对非首页做了动态 import 懒加载，但 Vite 默认的 modulePreload 机制会在动态 import 时一并预加载 JS 依赖，导致非首页的 JS chunk 在首页加载后就被预取，未真正做到"按需加载"。

## 方案

在 `vite.config.ts` 中配置 `build.modulePreload.resolveDependencies`：

- `hostType === 'html'`（入口 HTML）：返回全部 deps，即预加载首页相关的所有 chunk
- `hostType === 'js'`（动态 import）：只返回 CSS deps，过滤掉 JS deps，确保非首页 JS 仅在路由跳转时才拉取

## 修改文件

- `vite.config.ts`：添加 `build.modulePreload.resolveDependencies` 配置

## 验收标准

1. `npm run build` 构建成功
2. 构建产物中，入口 HTML 的 preload 仅包含首页相关 chunk
3. 其他页面的 JS chunk 不会在首页加载时被预加载
4. CSS 预加载行为不受影响（避免页面切换 FOUC）
