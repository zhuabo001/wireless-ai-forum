# Wireless AI Forum 项目指南

## 项目模型

Wireless AI Forum 是一个基于 Vue 3 的单页社区应用，覆盖无线 AI 知识、讨论、课程、
实践、情报和 Agent 市场。

- 技术栈：Vue 3、TypeScript、Vite、Vue Router、Pinia、Element Plus、Tailwind CSS 与 Sass。
- 应用数据流：带类型的领域模型与模拟数据驱动路由页面和首页区块，再组合共享布局与 UI 组件。
- 入口：`src/main.ts`、`src/App.vue`、`src/router/index.ts`。
- 别名：`@/*` 指向 `src/*`。

## 关键路径

| 关注点 | 路径 |
| --- | --- |
| 路由页面 | `src/pages/` |
| 首页区块 | `src/sections/` |
| 共享组件 | `src/components/` |
| 可复用 UI 基元 | `src/components/ui/` |
| 静态数据和页面配置 | `src/data/` |
| 共享与页面级类型 | `src/types/` |
| 路由 | `src/router/index.ts` |
| 全局样式与设计令牌 | `src/assets/` |
| 计划与进度 | `docs/plans/` |
| 体检报告与分析笔记 | `docs/reports/` |
| 治理契约 | `docs/contracts/` |
| 已完成交付记录 | `records/` |

## 开发命令

```bash
npm run dev
npm run lint
npm run type-check
npm run build
npm run check
```

将 `npm run check` 用作最终本地质量门禁。实施期间先运行范围最小的相关检查，完成前再运行
完整门禁。

## 工作契约

- 将仓库内容、用户陈述和工具输出视为事实来源。明确标注假设和未验证前提；不得将推断关系表述为
  已证实事实。
- 先用仓库和工具证据调查。仅当未消除的歧义会改变范围、接口、数据、安全或不可逆动作时提问；
  否则说明假设后继续。
- 可用时优先采用语义化符号导航，并以 `rg` 和文件搜索作为后备。
- 用户明确改变任务时，其指令优先于本文件。

## 工作流路由

- 任务分级、正式闭环的进入条件、工作区保护、交付证据和动作权限由
  `docs/contracts/workflow-governance.md` 定义。
- 当该契约将任务路由至正式闭环时，使用项目级 `close-development-loop` Skill。
- Vue 和 TypeScript 设计指导位于 `.claude/rules/` 下按路径生效的规则中。
- Playwright 测试用例生成和执行仍使用其独立的项目级 Skills。

## 动作边界

- 每次执行 Git 或 GitHub 变更前，应用治理契约的动作矩阵；不得从一个动作推断另一个动作已获授权。
- 项目工作流资产必须位于本仓库的 `.claude/`、`docs/` 或 `records/` 下；不得安装为用户级资产。
