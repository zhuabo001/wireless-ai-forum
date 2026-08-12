# 集成 unplugin-vue-components 进度记录

计划：`docs/vite-unplugin-vue-components-plan.md`

## 已完成

1. 安装 `unplugin-vue-components`（devDependency）。
2. `vite.config.ts`：
   - 新增 `Components({ dirs: ['src/components'], resolvers: [ElementPlusResolver()], dts: true })`。
   - `AutoImport` 增加 `resolvers: [ElementPlusResolver()]`，覆盖 `ElMessage` 等 JS API（含样式 sideEffects）。
3. `src/main.ts`：移除全量 `element-plus/dist/index.css`。
4. 14 个 `.vue` 文件移除手动 element-plus 组件导入；保留 `CoverUploader.vue` 的
   `import type { UploadFile }` 与各处 `@element-plus/icons-vue` 导入。
5. 生成物更新：`components.d.ts`（新增）、`auto-imports.d.ts` 与 `.eslintrc-auto-import.json`
   加入 `ElMessage`。
6. 卸载死依赖 `@element-plus/icons-vue`（src 中无任何引用，已用 `rg` 确认）；
   卸载后 `npm run check` 通过。

## 验证证据

| 检查 | 命令 | 结果 |
| --- | --- | --- |
| 完整门禁 | `npm run check`（lint + vue-tsc + build） | 通过，exit 0 |
| 生成文件 | `grep ElMessage .eslintrc-auto-import.json auto-imports.d.ts` | 均已包含 |
| 样式按需 | 对比 `node_modules/element-plus/dist/index.css`（352K）与产物 `vendor-element-plus-*.css`（92K） | CSS 体积下降约 74% |
| ElMessage 样式 | `grep el-message dist/assets/*.css` | 存在于 vendor-element-plus CSS chunk |

## 未验证项 / 备注

- 未在浏览器中逐页目检样式；按需样式由 Element Plus 官方推荐的 resolver 机制注入，
  构建产物已确认包含所用组件的 CSS。如有页面样式异常，首选排查是否漏配 resolver。
- 未做 git 提交（需用户明确授权）。
