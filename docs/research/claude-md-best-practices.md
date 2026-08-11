# `CLAUDE.md` 与同类仓库级 AI 指令文件实践

**研究日期**：2026-07-25

**来源范围**：Anthropic Claude Code、OpenAI Codex、GitHub Copilot、Cursor 官方文档。
**说明**：下文严格区分“官方事实”与“结合本项目的综合建议”。

## 一、官方事实

### 应承载什么

- Anthropic 将 `CLAUDE.md` 定位为每次会话加载的持久项目指令。适合放构建命令、编码约定、项目布局、架构决策和“始终如此”的规则；判断标准是这些信息是否会被反复解释，或新协作者是否也需要知道。[Claude Code：When to add to CLAUDE.md](https://code.claude.com/docs/en/memory#when-to-add-to-claudemd)
- 项目级 `CLAUDE.md` 应面向团队共享的项目标准；跨项目个人偏好应放在 `~/.claude/CLAUDE.md`，不提交的个人项目设置可放在 `CLAUDE.local.md`。[Claude Code：Choose where to put CLAUDE.md files](https://code.claude.com/docs/en/memory#choose-where-to-put-claudemd-files)
- GitHub 也建议仓库级指令包含项目概览、重要目录、编码标准，以及使用的工具、框架和库；这些陈述应对仓库中的大多数请求都有用。[GitHub Docs：Writing effective custom instructions](https://docs.github.com/en/copilot/concepts/prompting/response-customization#writing-effective-custom-instructions)

### 什么不该放

- Anthropic 明确建议：多步骤过程应做成 Skill；只对代码库某部分有意义的内容应做成路径作用域规则。[Claude Code：How Claude remembers your project](https://code.claude.com/docs/en/memory)
- GitHub 建议避免长篇通用文档、与真实系统无关的 AI 生成建议、一次性偏好、罕用细节以及让上下文过载的内容。[GitHub Docs：Keep instructions specific and grounded](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage#keep-the-copilot-instructionsmd-file-specific-and-grounded)
- GitHub 对 Copilot CLI 的建议更直接：如果行为只属于单一工作流，应使用 Skill；如果指令过大、过于具体并干扰当前任务，也应改用 Skill 或自定义代理。[GitHub Docs：Comparing customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features#custom-instructions)

### 如何拆分与分层

- Anthropic 支持组织、用户、项目、本地项目四级作用域；`.claude/rules/*.md` 可通过 `paths` 只在匹配文件被处理时加载。[Claude Code：Organize rules with `.claude/rules/`](https://code.claude.com/docs/en/memory#organize-rules-with-clauderules)
- 用 `@path` 把大文档导入 `CLAUDE.md` 只能改善文件组织，导入内容仍在启动时进入上下文；若目标是减少噪声，应使用路径规则或按需 Skill。[Claude Code：Import additional files](https://code.claude.com/docs/en/memory#import-additional-files)
- Skill 的主体仅在相关或显式调用时加载，适合反复使用的清单、多步骤流程，并可携带模板、脚本和参考资料。[Claude Code：Extend Claude with skills](https://code.claude.com/docs/en/skills)
- Codex 从全局 `AGENTS.md` 开始，再由项目根目录向当前目录逐层组合规则；越接近当前目录的规则越具体。其项目指令默认组合上限为 32 KiB。[OpenAI Codex：Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- GitHub 支持仓库级、路径特定和代理指令；路径特定规则的目的之一就是避免用局部信息挤占仓库级指令。[GitHub Docs：About repository custom instructions](https://docs.github.com/en/copilot/concepts/prompting/response-customization#about-repository-custom-instructions)
- Cursor Project Rules 支持 Always、文件 glob 自动附加、由 Agent 按描述请求、手动调用四种加载方式，也支持子目录嵌套规则。[Cursor Docs：Rules](https://cursor.com/docs/rules)

### 怎样写得可靠

- Anthropic 建议 `CLAUDE.md` 具体、简洁、有结构、可验证，单文件目标少于 200 行；应定期删除过时或冲突规则。[Claude Code：Write effective instructions](https://code.claude.com/docs/en/memory#write-effective-instructions)
- GitHub 建议使用短小、自包含、广泛适用的陈述，因为 custom instructions 会随每条消息发送。[GitHub Docs：Using custom instructions](https://docs.github.com/en/copilot/concepts/prompting/response-customization#using-custom-instructions)
- Cursor 建议规则聚焦、可行动、作用域明确；拆分大概念，必要时给出具体示例或文件引用，并避免模糊措辞。[Cursor Docs：Rules](https://cursor.com/docs/rules)
- Anthropic 明确说明 `CLAUDE.md` 是上下文而非强制配置；权限设置和 hook 才能硬性阻止行为。[Claude Code：CLAUDE.md vs auto memory](https://code.claude.com/docs/en/memory#claudemd-vs-auto-memory)
- OpenAI 建议将格式化和 lint 检查交给 CI，而不是重复写成代码审查自然语言规则。[OpenAI Codex：Add code review rules](https://developers.openai.com/codex/guides/agents-md#add-code-review-rules)
- Anthropic 建议验证时展示实际命令、输出或截图，而不是只声明成功。[Claude Code：Best practices](https://code.claude.com/docs/en/best-practices)

### 计划是否应强制

Anthropic 推荐复杂任务采用“探索 → 计划 → 实现 → 提交”，同时指出计划会增加开销：拼写修复、增加日志、变量改名等清晰小任务可以直接执行；若能用一句话描述 diff，可以跳过计划。[Claude Code：Explore first, then plan, then code](https://code.claude.com/docs/en/best-practices#explore-first-then-plan-then-code)

## 二、综合建议

以下为对官方资料的综合推断，不是单一厂商的原文要求。

| 内容 | 推荐载体 |
|---|---|
| 跨项目事实观、沟通方式、个人工具偏好 | 用户级指令 |
| 本项目大多数任务都需要的稳定事实与约定 | 根 `CLAUDE.md` / `AGENTS.md` |
| 只对某类文件或目录生效的规范 | 路径规则或嵌套指令文件 |
| 可重复调用的多步骤流程 | Skill |
| 详细背景、模板、示例、API 资料 | 普通文档或 Skill supporting files |
| 可确定判断的质量要求 | lint、类型检查、测试、CI、hook |
| 一次性进度、任务状态、实施历史 | plan、progress、record 或 issue |

根指令文件应更像“项目契约与导航”，回答项目是什么、权威信息在哪里、哪些命令已验证、哪些架构边界不能突破、完成需要什么证据；不应成为完整百科或 SOP。

“不知道就是不知道”更适合作为用户级、跨项目行为原则。但不建议写成“有疑问一律先问”，更可执行的表述是：

> 以用户明确陈述、仓库内容和工具输出为事实依据。不得把推断表述为事实；先通过现有证据验证。仅当剩余歧义会实质改变范围、公共接口、数据模型、安全边界或不可逆操作时询问用户，否则明确假设后继续。

## 三、对当前项目的启示

本项目根 `CLAUDE.md` 的问题主要不是长度，而是把不同生命周期和作用域的内容混在一起：

| 当前内容 | 建议去向 |
|---|---|
| plan、progress、逐步 commit、记录 hash、独立验证、人工验收、record | `close-development-loop` Skill |
| HTML 转 Vue 流程 | `html-to-vue` Skill，按需引用现有 `page-design/rules/html-convert-to-vue.md` |
| Vue SFC 设计规范 | 对 `**/*.vue` 生效的路径规则 |
| TypeScript 设计规范 | 对 `**/*.{ts,vue}` 生效的路径规则 |
| `strict`、`any`、模板与格式等可判定要求 | `tsconfig`、ESLint、`eslint-plugin-vue`、`vue-tsc`、CI |
| Serena 等工具使用偏好 | 用户级或 `CLAUDE.local.md`；团队共识时才进入项目规则 |
| 事实、证据和提问阈值 | 用户级指令；项目级最多保留一句团队版 |

需求闭环流程具备触发条件、顺序步骤、状态、模板、验证和输出物，是官方定义中最典型的 Skill。根文件只需保留一条短路由。

“任何代码开发都必须先有 plan”建议改成风险分级：

- 研究、诊断、解释和代码审查无需开发计划；
- 边界清楚、低风险、可一句话描述 diff 的小修改可直接实施并验证；
- 跨文件、多个验收条件、公共接口或数据模型变更需要计划；
- 用户明确提供 plan 时以该 plan 为规格。

本项目当前已有 TypeScript `strict: true` 和 `vue-tsc`，但 `package.json` 尚无 `lint`、`type-check` 脚本，也未发现正式 ESLint 配置。后续应把可机器判断的 Vue/TypeScript 规则下沉到工具，把“何时拆组件、何时使用 Pinia、状态边界”等设计判断留在路径规则中。

另外，Anthropic 虽建议通过导入复用已有 `AGENTS.md`，但当前仓库的 `AGENTS.md` 主要是工具生成的历史 memory context，不是精炼稳定的跨代理规则，不宜直接全量导入新的 `CLAUDE.md`。应先把稳定规则与临时记忆分开，再选择单一规则源。

## 四、建议的目标结构

```text
CLAUDE.md                         # 项目概览、核心边界、命令、验证证据、工作流路由
.claude/
├── rules/
│   ├── vue.md                    # paths: **/*.vue
│   └── typescript.md             # paths: **/*.{ts,vue}
└── skills/
    ├── close-development-loop/
    └── html-to-vue/
page-design/rules/                # 详细参考文档
docs/                             # 计划、研究和设计文档
records/                          # 完成后的实施记录
eslint.config.js
tsconfig.json
package.json                      # lint、type-check、test、build
.github/workflows/                # CI 硬验证
```

## 参考资料

- [Anthropic：Claude Code memory and instructions](https://code.claude.com/docs/en/memory)
- [Anthropic：Claude Code best practices](https://code.claude.com/docs/en/best-practices)
- [Anthropic：Claude Code skills](https://code.claude.com/docs/en/skills)
- [OpenAI Codex：AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- [GitHub Copilot：Response customization](https://docs.github.com/en/copilot/concepts/prompting/response-customization)
- [GitHub Copilot：Optimize AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage)
- [Cursor：Rules](https://cursor.com/docs/rules)
