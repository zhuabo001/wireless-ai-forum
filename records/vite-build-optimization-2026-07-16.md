# Vite 打包优化 - 实施记录

**日期**: 2026-07-16

**目的**: 优化 Vite 打包产物的预加载策略，限制为仅首页相关内容预加载，其他页面 chunk 按需加载。

## 修改文件

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `vite.config.ts` | 新增配置 | 添加 `build.modulePreload.resolveDependencies` 配置，按宿主类型区分预加载策略 |

## 核心改动

```ts
build: {
  modulePreload: {
    resolveDependencies: (_url, deps, { hostType }) => {
      if (hostType === 'html') return deps           // 首页：预加载全部
      return deps.filter(d => d.endsWith('.css'))    // 其他页：只预加载 CSS
    },
  },
}
```

## 对其他模块的影响

- **无影响**。仅修改了 Vite 构建配置，不影响任何业务代码。
- 路由懒加载策略保持不变（router/index.ts 未改动）。
- 构建产物数量不变（237 个文件），大小基本持平。
- CSS 预加载行为不受影响，页面切换不会出现 FOUC。
- 共享依赖（vue、element-plus、pinia）已打包进入口 chunk，所有页面共用。

## 验证结果

- `npm run build` 构建成功（2.03s）
- `dist/index.html` 无多余 `<link rel="modulepreload">` 标签
- 非首页 JS chunk 仅在路由跳转时按需加载
- 对抗性检查通过，无遗漏场景
