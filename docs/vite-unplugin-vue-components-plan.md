# 集成 unplugin-vue-components（Element Plus 按需引入）计划

## 背景

当前 Element Plus 使用方式：

- `src/main.ts` 全量引入 `element-plus/dist/index.css`。
- 14 个 `.vue` 文件中手动 `import { ElXxx } from 'element-plus'`（组件已按需，样式未按需）。
- 已有姊妹插件 `unplugin-auto-import`（自动导入 Vue API）。
- 未使用 `v-loading` / `v-infinite-scroll` 等指令（已用 `rg` 验证），迁移路径无指令样式遗漏风险。

## 目标

1. 安装并接入 `unplugin-vue-components`：
   - `ElementPlusResolver`：模板中的 `<el-*>` 组件自动按需导入（含对应 CSS）。
   - 本地组件目录 `src/components` 自动导入，生成 `components.d.ts`（`tsconfig.json` 已 include）。
2. `unplugin-auto-import` 增加 `ElementPlusResolver`，使 `ElMessage` 等 JS API 自动导入（含样式 sideEffects）。
3. 移除 `src/main.ts` 的全量 `element-plus/dist/index.css`。
4. 移除 14 个文件中手动 element-plus 组件导入；保留 `import type { UploadFile }` 与 `@element-plus/icons-vue` 导入。

## 验证

- `npm run check`（lint + type-check + build）。
- 构建产物中确认不再出现全量 element-plus CSS（对比 dist CSS 体积）。
- 确认生成 `components.d.ts` 且 `ElMessage` 等 API 类型不报错。

## 不做的事

- 不改动 `src/sections` 的导入方式（sections 组件仍由页面手动组合）。
- 不调整 codeSplitting 分组规则（`vendor-element-plus` chunk 自然变小，规则保持有效）。
- 不提交 git commit（需用户另行授权）。
