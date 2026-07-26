# Shadow-Azure/cli-box `CLAUDE.md` 分析

**研究日期**：2026-07-25

**目标原文**：[Shadow-Azure/cli-box `CLAUDE.md`，commit `e42b20c`](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md)

**原文规模**：282 行。
**分析基准**：Anthropic 官方 [CLAUDE.md](https://code.claude.com/docs/en/memory)、[Skills](https://code.claude.com/docs/en/skills)、[Hooks](https://code.claude.com/docs/en/hooks-guide) 文档。

## 结论

这是一份成熟、可执行、质量意识很强的**完整开发 SOP**，但不是理想形态的**根级常驻 `CLAUDE.md`**。

它最值得借鉴的是清晰的阶段边界、测试分层、验证命令、审查闭环与“不自动合入”的安全线；最需要调整的是将八阶段流程、Superpowers 编排、Release 手册和 GitHub 发布动作从根文件移到按需 Skill。根文件应缩成项目事实、核心架构约束、统一验证入口和少量不可越过的安全规则。

## 一、原文定位与结构

### 文档自我定位

原文开头写明：

> “用户发送需求后，Claude 读取本文档，按照预设工作流自动执行完整开发周期。”

并将核心原则概括为：

> “Superpowers 驱动 · 测试先行 · 代码检视 · 不自动合入主分支”

来源：[原文第 1–5 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L1-L5)。

因此它的主要定位不是“帮助 Agent 理解项目”，而是“收到需求后自动编排完整研发周期”。项目介绍只是第一章，主体是流程引擎。

### 章节结构

| 章节 | 主要内容 | 实际职责 |
|---|---|---|
| 一、项目概览 | 产品、架构图、技术栈 | 项目上下文 |
| 二、开发工作流 | 分支、设计、测试、计划、实现、审查、Release、PR | 多步骤 SOP |
| 三、Git 规范 | commit、scope、提交粒度 | 版本控制规范 |
| 四、目录速查 | 核心模块和产物位置 | 仓库导航 |
| 五、测试层级 | UT、IT、E2E、Release | 测试参考手册 |
| 六、Superpowers 技能 | 阶段到 Skill 的映射、调试流程 | Skill 路由与局部流程 |
| 七、关键约束 | 语言、合入、TDD、CLI、截图、零侵入 | 项目原则与安全线 |

来源：[完整原文](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md)。

## 二、规则类型

原文混合了至少七类规则：

1. **稳定项目事实**：产品定位、Rust/Electron 架构、技术栈、模块路径。
2. **架构不变量**：“零侵入”“所有操作在 OS 层完成”。[原文第 270–278 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L270-L278)
3. **完整任务流程**：从新分支到 PR 和 CI 的八阶段顺序。[原文第 29–169 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L29-L169)
4. **质量策略**：TDD、根因调试、逐 Task 审查、最终审查。
5. **确定性检查**：`cargo test`、Clippy、fmt、typecheck、Vitest、Playwright、残留检查。
6. **外部变更动作**：切分支、pull、push、创建和更新 PR。
7. **Skill 编排**：何时调用 brainstorming、writing-plans、subagent-driven-development 等 Superpowers。

这种混合能让单文件看起来完整，却使所有规则无论任务是否相关都进入会话上下文。

## 三、优点

### 1. 项目上下文短而有信息密度

项目概览同时给出产品边界、核心数据流、三层架构和技术栈，足以让新 Agent 快速建立模型。[原文第 9–27 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L9-L27)

### 2. 流程有阶段、输入和产物

设计阶段产出 spec，计划阶段产出 plan，每个 Task 要列 Files、Steps、Verification、Commit，Release 阶段产出截图和报告，PR 描述固定包含 Problem、Solution、Test Plan。它不是“认真测试”之类空泛口号，而是可检查的交付契约。[原文第 43–76 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L43-L76)、[第 151–167 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L151-L167)

这与 Anthropic“指令应具体到可以验证”的建议一致。[Anthropic：Write effective instructions](https://code.claude.com/docs/en/memory#write-effective-instructions)

### 3. 测试体系与用户场景对齐

原文区分 UT、IT、E2E 和 Release 测试，并明确每层工具、边界与产物；bug 修复先补复现用例，Release 测试要求 CLI 驱动与截图验证。这使“验证”从编译成功延伸到真实用户路径。[原文第 55–68 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L55-L68)、[第 224–248 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L224-L248)

### 4. 质量门禁有统一入口

`sh test.sh` 聚合 Rust 测试、Clippy、fmt、TS 类型检查、Vitest、Playwright 和项目特有残留检查；Agent 不必猜测验证组合。[原文第 98–116 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L98-L116)

### 5. 安全边界清楚

“PR 保持 open，不执行 merge”是少数值得在根文件中高可见度保留的硬边界，因为它限制了高影响外部动作。[原文第 140–149 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L140-L149)

## 四、问题与风险

### 1. 篇幅超过官方建议目标

该文件为 282 行。Anthropic 当前建议每个 `CLAUDE.md` 目标少于 200 行；更长文件会消耗更多上下文并降低遵循程度。[Anthropic：Write effective instructions](https://code.claude.com/docs/en/memory#write-effective-instructions)

问题不只是数字超标，而是其中大部分仅在“正式功能开发”“Release 测试”或“PR 收尾”时才相关。

### 2. 多步骤过程本应由 Skill 承载

第二章从阶段 0 到阶段 7 是完整流程；第六章又指定每阶段应调用哪个 Skill。Anthropic 明确建议：反复使用的清单、多步骤过程，或已从“事实”增长为“过程”的 `CLAUDE.md` 内容，应迁移为 Skill；Skill 主体只在使用时加载。[Anthropic：Extend Claude with skills](https://code.claude.com/docs/en/skills)

原文件甚至已经依赖 Superpowers Skills，因此更自然的结构应是根文件只做路由，流程细节回归 Skills。

### 3. 测试内容有明显重复

测试层级至少出现三次：

- 阶段 2 的测试策略；
- 阶段 6 的质量门禁与 Release 测试；
- 第五章的 UT/IT/E2E/Release 解释；
- 第七章又重复 CLI 优先与截图验证。

这些内容并非矛盾，但增加了漂移风险。例如未来测试命令或覆盖边界变化时，需要同步维护多处。

### 4. Superpowers 规则重复并过度常驻

第二章逐阶段声明使用的 Skill，第六章再用表格复述，第七章再次要求“使用 Superpowers 技能完成各阶段工作，不跳过”。[原文第 252–277 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L252-L277)

Skill 的触发条件本应写在 Skill metadata/description 中；把同一映射写三遍既占上下文，也容易与 Skill 自身更新脱节。

### 5. “所有需求执行完整周期”约束过重

原文要求任何新需求都经过 brainstorming、2–3 个方案、用户 review spec、测试设计、详细 plan、子代理逐 Task 审查、Release 构建、手动 Release 测试和 PR。这个流程对大型功能很强，但对文档修正、小范围重命名、简单测试补充或只读诊断成本过高。

更合理的是按风险分类触发：

- 小型低风险修改：实现、相关测试、统一质量门禁；
- 中型功能：设计/计划/TDD/审查；
- Release 相关或跨层变更：完整周期和人工场景验证。

### 6. Git 与 GitHub 动作假设过多

阶段 0 直接执行：

```bash
git checkout main && git pull
git checkout -b feat/<scope>-<short-description>
```

阶段 7 默认 push 并创建 PR。[原文第 33–41 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L33-L41)、[第 140–149 行](https://github.com/Shadow-Azure/cli-box/blob/e42b20c3a70aa5385acf3e0bd5b0ea5fa16861ff/CLAUDE.md#L140-L149)

这隐含假设当前工作树干净、当前分支可切换、默认分支为 `main`、允许拉取网络、用户授权创建远端分支和 PR。它们属于有状态、可能需要权限的工作流步骤，不宜因用户发出任意需求就自动触发。

### 7. 某些启发式规则过于绝对

- “TDD：先写失败测试”对行为变更和 bug 很好，但并非文档、构建元数据或纯机械变更都适用。
- “每步 Release 操作都截图”应只在 Release 验证 Skill 中生效。
- “3 次修复失败 → 质疑架构”是调试 Skill 的启发式，不是所有任务常驻的项目事实。
- “每个 Task 派发实现子代理”依赖具体工具和运行环境，属于 Skill 的执行机制。

这些规则可以保留，但应缩小作用域，而不是删除其质量意图。

## 五、应该保留或迁移到哪里

### 保留在根 `CLAUDE.md`

建议控制为约 60–100 行：

- 一段项目定位、技术栈和精简架构图；
- 核心架构不变量：“零侵入，目标应用无需适配，操作在 OS 层完成”；
- 最重要的模块入口，而非完整目录百科；
- 统一验证入口：普通变更运行 `sh test.sh`；
- 代码和注释使用英文等团队级语言约定；
- 高影响安全线：不得自动 merge，不得未经明确授权 push/创建 PR；
- 一条流程路由：正式功能开发使用对应 development Skill，Release 验证使用 release Skill。

这符合 Anthropic“根文件保留每次会话都应掌握的构建命令、约定、项目布局和 always-do 规则”的定位。[Anthropic：When to add to CLAUDE.md](https://code.claude.com/docs/en/memory#when-to-add-to-claudemd)

### 迁移到 Skills

建议拆成可组合的三个 Skill，而不是一个巨型 Skill：

| Skill | 迁移内容 |
|---|---|
| `develop-feature` | 需求澄清、方案比较、spec、测试设计、plan、TDD、逐 Task 实现与审查 |
| `verify-release` | `release.sh`、`tests/release_test.md`、CLI-only、截图目录、报告模板、回归规则 |
| `finish-branch` | commit 策略、push、PR 创建/更新、Problem/Solution/Test Plan、CI 跟进、不 merge |

`systematic-debugging`、`requesting-code-review` 等既有 Superpowers 应由这些编排 Skill 调用，根文件无需重复它们的内部规则。

### 迁移到路径规则

`.claude/rules/` 可按文件范围保留局部知识：

- `rust.md`：`crates/**/*.rs`，Rust 惯用法和测试位置；
- `electron.md`：`electron-app/**/*.{ts,tsx}`，React/TypeScript 约定；
- `integration-tests.md`：`crates/cli-box-core/tests/**/*.rs`，`tower::ServiceExt::oneshot` 约定；
- `e2e.md`：`tests/**/*.sh`、`test.sh`，CLI 驱动和测试隔离规则。

Anthropic 官方说明路径规则只在处理匹配文件时加载，可减少噪声。[Anthropic：Path-specific rules](https://code.claude.com/docs/en/memory#path-specific-rules)

### 迁移到 hooks / 权限规则

- 用 `PreToolUse` 或权限规则拦截 `git merge`、直接向 `main` push 等真正禁止的行为；
- 可用 Stop hook 检查要求的质量门禁是否已执行，但要注意 Stop 在每次 Claude 结束回复时触发，不只在任务完成时触发；
- 格式化可由文件修改后的 hook 自动运行，但完整测试更适合显式 Skill/CI，避免每次编辑都执行重型门禁。

Anthropic 将 hooks 定位为在生命周期节点自动运行、提供确定性控制；`PreToolUse` 可以在执行前拒绝工具调用。[Anthropic：Hooks](https://code.claude.com/docs/en/hooks-guide)

### 迁移到 lint、测试脚本和 CI

- `cargo fmt --check`、Clippy `-D warnings`、TS typecheck、Vitest、Playwright 和残留扫描应由 `test.sh` 与 CI 保证；
- 根文件只声明统一入口和适用条件，不重复列出工具内部清单；
- PR 描述必含 Problem/Solution/Test Plan 可通过 PR template 或 CI 检查，而不只依赖模型记忆。

### 迁移到普通文档

- 完整架构图和模块职责：`docs/architecture.md`；
- 完整目录速查：README 或 architecture 文档；
- UT/IT/E2E/Release 的详细边界：`docs/testing.md`；
- Release 手动步骤：继续由 `tests/release_test.md` 作为唯一事实源；
- 版本、创建日期、维护者等文档元数据：普通文档，不占根指令常驻上下文。

## 六、推荐的最终分层

```text
CLAUDE.md                         # 60–100 行：事实、边界、命令、路由
.claude/
├── rules/
│   ├── rust.md
│   ├── electron.md
│   ├── integration-tests.md
│   └── e2e.md
├── skills/
│   ├── develop-feature/
│   ├── verify-release/
│   └── finish-branch/
└── hooks/
    └── protect-git-policy.sh
docs/
├── architecture.md
└── testing.md
tests/release_test.md             # Release 场景唯一事实源
test.sh                           # 本地质量门禁唯一入口
.github/
├── pull_request_template.md
└── workflows/                    # CI 硬门禁
```

## 最终评价

如果把它当作“新人可读的项目研发手册”，完成度很高；如果把它当作“每次会话都注入的根 `CLAUDE.md`”，则职责明显过载。

最值得复制的不是这 282 行本身，而是它背后的设计：

1. 明确项目不变量；
2. 每个阶段都有可检查产物；
3. 测试覆盖从单元延伸到真实用户路径；
4. 审查与 CI 构成闭环；
5. 高影响外部动作有清晰安全线。

重构目标应是保留这五点，同时让流程按需加载、局部规则按路径加载、确定性约束由 hooks/lint/CI 执行。
