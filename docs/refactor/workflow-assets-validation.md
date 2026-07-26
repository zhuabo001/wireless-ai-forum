# 工作流资产验证记录

验证日期：2026-07-26

工作分支：`codex/refactor-workflow-assets`

## 自动检查

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| Skill 结构 | 通过 | `quick_validate.py .claude/skills/close-development-loop` 输出 `Skill is valid!` |
| Skill 触发措辞 | 通过 | description 仅描述任务类型、结果和显式请求，不包含 Agent 品牌 |
| Claude 显式调用 | 通过 | `.claude/settings.json` 将 Skill 设为 `user-invocable-only` |
| Codex 显式调用 | 通过 | `agents/openai.yaml` 设置 `allow_implicit_invocation: false` |
| 根文件规模 | 通过 | `CLAUDE.md` 为 72 行 |
| 路径规则规模 | 通过 | Vue 与 TypeScript Rules 各 15 行 |
| ESLint | 通过 | `npm run lint` |
| Vue/TypeScript 类型检查 | 通过 | `npm run type-check` |
| 完整本地门禁 | 通过 | `npm run check`，包含 lint、type-check、Vite build |

Vite build 保留依赖 `@vueuse/core` 的 Rolldown pure annotation 警告和既有大 chunk
警告，构建成功且退出码为 0。这些警告不由本次工作流资产改造引入。

## 对抗场景

| 场景 | 预期 | 结果 |
| --- | --- | --- |
| L0 只读解释 | 不创建 plan、progress、record 或 commit | 通过：根契约和 Skill 路由均明确排除 |
| L1 单点低风险修改 | 直接实施并运行匹配验证 | 通过：治理契约允许 plan 可选、无 progress |
| L2 多文件正式功能 | plan、progress、里程碑证据与独立验证 | 通过：Skill 步骤和模板覆盖 |
| 验证失败 | 保持里程碑未完成 | 通过：Skill 要求复现、根因验证和回归 |
| 脏工作区 | 保护并精确暂存用户改动 | 通过：治理契约、根文件和 Skill 三层路由一致 |
| 未授权普通 commit | 不提交 | 通过：普通请求默认不授权 |
| 显式闭环本地 commit | 验证后仅提交任务范围增量 | 通过：Skill 和治理契约一致 |
| 未知事实或根因 | 区分事实、假设和未验证项 | 通过：progress 模板与完成条件覆盖 |
| push、PR、merge | 分别检查明确授权和目标 | 通过：不由闭环调用隐式扩张 |

## Forward test

独立代理在不修改文件的 dry-run 中处理了一个跨三个 Vue 文件、包含多个验收条件、
已有未提交修改，并要求 commit、push 和 PR 的请求。

结果：

- 正确分类为 L2。
- 正确选择 plan、progress 和人工验收后的 record。
- 正确要求针对性验证、`npm run type-check`、`npm run check` 和独立复核。
- 正确识别显式 Skill 调用只授权任务范围内的本地 commit。
- 正确识别 push 仍需明确远端和目标分支，merge 和删除没有授权。
- 正确选择逐 hunk 基线、精确暂存和无法隔离时跳过 commit 的保护策略。

## 已知限制与后续观察

- Skill 的首次真实项目使用仍应观察触发准确率、progress 模板负担和人工验收恢复路径。
- 当前仓库没有自动化测试套件，统一门禁覆盖 lint、类型检查和构建；行为测试应按具体需求补充。
- Vite 构建体积警告属于独立性能优化议题，不扩大本次改造范围。
