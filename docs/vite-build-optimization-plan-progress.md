# Vite 打包优化 - 任务面板

| 任务/步骤 | 状态 | Commit 信息 & Hash |
|-----------|------|-------------------|
| 1. 在 vite.config.ts 中添加 modulePreload.resolveDependencies 配置 | 完成 | feat: optimize Vite build - limit preload to homepage chunks, lazy-load other page chunks on demand (432b0b5) |
| 2. 验证构建产物，确认非首页 JS 不被预加载 | 完成 | - |
