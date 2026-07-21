# vue-doctor 扫描问题修复方案

## 背景

在当前项目执行 `npx vue-doctor --verbose` 扫描（vue-doctor v0.0.5），结果：

- 健康分 **48 / 100（Critical）**
- **4 errors + 24 warnings**，分布在 17/125 个文件

逐项对照源码人工核查后，结论：**28 项中仅 10 项为真实问题，其余 18 项为工具误报**（工具的静态分析能力限制，详见下方分析）。

## 逐项核查结论

### 一、真实问题（10 项，需修复代码）

| # | 规则 | 位置 | 问题 | 修复方式 |
|---|------|------|------|----------|
| 1 | `require-button-type` | `src/sections/ForumSection.vue:14` | `<button>` 缺少显式 `type`，在表单上下文可能误触发 submit | 添加 `type="button"` |
| 2 | `no-index-as-key` | `src/sections/HeroSection.vue:66` | changelog 列表 `:key="i"` | 改为 `:key="item.version"`（ChangelogItem.version 唯一） |
| 3 | `no-index-as-key` | `src/sections/CoursesSection.vue:13` | courses 列表 `:key="i"` | 改为 `:key="c.title"` |
| 4 | `no-index-as-key` | `src/sections/AtmosphereSection.vue:15` | events 列表 `:key="i"` | 改为 `:key="e.title"` |
| 5 | `no-index-as-key` | `src/sections/IntelligenceSection.vue:16` | intelligenceNews 列表 `:key="i"` | 改为 `:key="item.title"` |
| 6 | `no-index-as-key` | `src/sections/PracticesSection.vue:14` | practices 列表 `:key="i"` | 改为 `:key="p.title"` |
| 7 | 死代码（files） | `src/components/GlitchText.vue` | 全项目无任何引用（已 grep 确认） | 删除文件 |
| 8 | 死代码（files） | `src/composables/useScrollReveal.ts` | 全项目无任何引用（已 grep 确认），删除后 composables 目录为空 | 删除文件及空目录 |
| 9 | 死代码（files） | `env.d.ts` | 内容为 `/// <reference types="vite/client" />`，但位于项目根目录，不在 tsconfig `include`（`src/**/*.ts` 等）范围内，实际未被加载 | 删除文件，删除后必须跑 type-check 验证 |
| 10 | 死代码（exports） | `src/data/pageDesign/market.ts:8` | `typeStyles` 仅在本文件内部使用（line 26 等），`export` 从未被外部引用 | 去掉 `export` 关键字，保留文件内使用 |

### 二、工具误报（18 项，不改代码，通过配置忽略）

| 规则 | 数量 | 误报原因（已逐一核实源码） |
|------|------|---------------------------|
| `no-click-without-keyboard-handler` | 2 | `AgentMarketSection.vue:21` 是 `ElButton`（element-plus 渲染为原生 `<button>`）；`EngineeringSection.vue:21` 是 `ImagePreview` 组件，其根节点本身就是 `<button type="button">`。两者均天然支持键盘交互，工具无法识别组件内部实现 |
| `require-img-alt` | 1 | `CoursesSection.vue:15` 已有动态绑定 `:alt="c.instructor"`，工具只识别静态 `alt` 属性 |
| `no-barrel-import` | 14 | 被标记的导入均来自 `src/data/home.ts`、`src/data/navigation.ts` —— 它们是普通数据模块（多个具名 export 的单个 .ts 文件），**并非 barrel（index 转发）文件**，具名导入不阻碍 tree-shaking；`main.ts` 中 `./router`、`./store` 为目录 index 惯例导入，同样无 bundle 影响 |
| `prefer-async-component` | 1 | 标记的是 `HeroSection.vue` 中的 `ActivityCalendar`，位于首页 Hero **首屏可见区域**，异步加载会导致首屏内容闪烁/跳动，弊大于利；真正的重型组件（mermaid/editor 等）已通过路由级 code splitting 按需加载（见 vite-code-splitting-plan） |

## 方案

### Step 1：修复 Accessibility 真实问题

- `src/sections/ForumSection.vue:14`：`<button>` 添加 `type="button"`

### Step 2：修复 index-as-key（5 处）

按上表 #2~#6，将 `:key="i"` 替换为对应数据项的唯一字段（`title` / `version`）。这些数据均为静态展示列表，实际不会重排，此处属于规范性修复，无运行时行为变化。

### Step 3：清理死代码（4 项）

- 删除 `src/components/GlitchText.vue`
- 删除 `src/composables/useScrollReveal.ts` 及空的 `src/composables/` 目录
- 删除 `env.d.ts`
- `src/data/pageDesign/market.ts`：`export const typeStyles` → `const typeStyles`

### Step 4：配置 vue-doctor.config.json 忽略误报规则

在项目根目录 `vue-doctor.config.json` 中增加 `ignore.rules`：

```json
{
  "diff": false,
  "ignore": {
    "rules": [
      "vue-doctor/no-click-without-keyboard-handler",
      "vue-doctor/require-img-alt",
      "vue-doctor/no-barrel-import",
      "vue-doctor/prefer-async-component"
    ]
  }
}
```

> 说明：vue-doctor 的 ignore 配置粒度仅支持"整条规则全局忽略"或"整个文件忽略"，不支持单条规则针对指定文件/行忽略。上述 4 条规则的误报模式在本项目具有普遍性（ElButton/组件内 button、动态 `:alt`、数据模块具名导入、首屏组件），因此选择全局忽略，并在本文档留存忽略原因。人工 code review 时仍应关注真实的可访问性与分包问题。

### Step 5：验证

1. `npx vue-doctor --verbose` 重新扫描：0 errors、0 warnings，分数显著提升
2. `npm run build` 构建成功（确认删除文件不影响构建）
3. `npx vue-tsc --noEmit` 类型检查通过（重点验证 env.d.ts 删除后无影响）
4. `npm run dev` 启动后首页各 section 渲染正常（配合 chrome-devtools 或人工确认）

## 修改文件清单

| 文件 | 操作 |
|------|------|
| `src/sections/ForumSection.vue` | 修改（+`type="button"`） |
| `src/sections/HeroSection.vue` | 修改（key） |
| `src/sections/CoursesSection.vue` | 修改（key） |
| `src/sections/AtmosphereSection.vue` | 修改（key） |
| `src/sections/IntelligenceSection.vue` | 修改（key） |
| `src/sections/PracticesSection.vue` | 修改（key） |
| `src/data/pageDesign/market.ts` | 修改（去 export） |
| `src/components/GlitchText.vue` | 删除 |
| `src/composables/useScrollReveal.ts` | 删除（含空目录） |
| `env.d.ts` | 删除 |
| `vue-doctor.config.json` | 修改（+ignore.rules） |

对其他模块的影响：均为局部模板/配置修改与未引用文件删除，无对外接口变化，不影响路由、状态、构建配置。

## 验收标准

1. `npx vue-doctor --verbose` 扫描 0 errors / 0 warnings
2. `npm run build` 成功，产物无异常
3. `npx vue-tsc --noEmit` 通过
4. 首页及各 section 功能、视觉无回归
