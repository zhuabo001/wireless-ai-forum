# Vue Doctor 扫描问题修复 - 实施记录

**日期**: 2026-07-21

**目的**: 修复 `npx vue-doctor --verbose` 扫描发现的真实问题，配置忽略误报规则，将健康分从 48/100 提升至 100/100。

## 扫描结果变化

| 指标 | 修复前 | 修复后 |
|------|--------|--------|
| 健康分 | 48 / 100 (Critical) | **100 / 100 (Perfect)** |
| Errors | 4 | **0** |
| Warnings | 24 | **0** |
| 受影响文件 | 17 / 125 | **0 / 122** |

## 修改文件

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `src/sections/ForumSection.vue` | 修改 | `<button>` 添加 `type="button"` |
| `src/sections/HeroSection.vue` | 修改 | changelog v-for `:key="i"` → `:key="item.version"` |
| `src/sections/CoursesSection.vue` | 修改 | courses v-for `:key="i"` → `:key="c.title"` |
| `src/sections/AtmosphereSection.vue` | 修改 | events v-for `:key="i"` → `:key="e.title"` |
| `src/sections/IntelligenceSection.vue` | 修改 | intelligenceNews v-for `:key="i"` → `:key="item.title"` |
| `src/sections/PracticesSection.vue` | 修改 | practices v-for `:key="i"` → `:key="p.title"` |
| `src/data/pageDesign/market.ts` | 修改 | `export const typeStyles` → `const typeStyles`（仅内部使用） |
| `src/components/GlitchText.vue` | 删除 | 无引用死代码 |
| `src/composables/useScrollReveal.ts` | 删除 | 无引用死代码（目录同时清空） |
| `env.d.ts` | 删除 | 不在 tsconfig include 范围内，实际未加载 |
| `vue-doctor.config.json` | 新增 | 配置 4 条 ignore.rules 忽略系统性误报 |
| `docs/plans/vue-doctor-fix-plan.md` | 新增 | 修复计划文档 |
| `docs/plans/vue-doctor-fix-plan-progress.md` | 新增 | 任务面板 |

## 误报规则处理

以下 4 条规则经源码逐一核查确认为误报，通过 `vue-doctor.config.json` 配置全局忽略：

| 规则 | 误报数量 | 误报原因 |
|------|----------|----------|
| `no-click-without-keyboard-handler` | 2 | ElButton 和 ImagePreview 根节点均为原生 `<button>`，天然支持键盘，工具无法识别组件内部实现 |
| `require-img-alt` | 1 | 已有动态绑定 `:alt="c.instructor"`，工具只识别静态 alt 属性 |
| `no-barrel-import` | 14 | 被标记的导入来自 `data/home.ts`、`data/navigation.ts`（普通数据模块，非 barrel 文件），不阻碍 tree-shaking |
| `prefer-async-component` | 1 | ActivityCalendar 位于首页首屏，异步加载会导致内容闪烁 |

## Commit 记录

| Commit | 说明 |
|--------|------|
| `d24af3b` | fix: add explicit type=button to ForumSection topic button |
| `ebeb29e` | fix: replace index keys with stable keys in v-for lists |
| `3dc6cf2` | chore: remove dead code flagged by vue-doctor |
| `ebfd3b9` | chore: ignore 4 systematically-misfiring vue-doctor rules |
| `68457a3` | chore: mark all tasks complete and verification passed |

## 对其他模块的影响

- **无影响**。所有修改均为局部模板属性调整（type、key）、未引用文件删除、配置文件新增，不涉及路由、状态管理、构建配置、数据接口的任何变更。
- 删除的文件（GlitchText.vue、useScrollReveal.ts、env.d.ts）经全局搜索确认无任何引用。
- `typeStyles` 去掉 export 后仅在 `market.ts` 文件内部使用，不影响任何外部模块。
- `npm run build` 构建成功，`vue-tsc` 类型检查通过。

## 验证结果

- `npx vue-doctor --verbose` 扫描：100/100 Perfect，0 errors，0 warnings
- `npm run build` 构建成功（~2s），产物无异常
- `npx vue-tsc --noEmit` 类型检查通过（仅 TS 6 baseUrl deprecation warning，与本次修改无关）
- 对抗性检查：无遗漏、无回归、无额外修改引入
