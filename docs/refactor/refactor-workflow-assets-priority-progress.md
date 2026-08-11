# 工作流资产重构进度

对应计划：`docs/refactor/refactor-workflow-assets-priority.md`

| 阶段 | 状态 | 产物与验证证据 |
| --- | --- | --- |
| P0 固化治理边界 | 完成 | `docs/contracts/workflow-governance.md` 已记录资产迁移、保护边界和验收标准 |
| P1 重写需求闭环契约 | 完成 | 已固化 L0–L3、完成证据、根因纪律和 Git/GitHub 授权矩阵 |
| P2 盘点并收敛机器质量门禁 | 完成 | 建立 ESLint Flat Config 与 `lint/type-check/check`；`npm run lint`、`npm run type-check` 通过 |
| P3 创建需求闭环 Skill | 完成 | 项目级 Skill、progress/record 模板与 UI 元数据已创建；官方结构校验通过 |
| P4 拆分路径规则 | 完成 | 创建 15 行 Vue Rule 与 15 行 TypeScript Rule，均使用路径 frontmatter |
| P5 瘦身根 CLAUDE.md | 完成 | 根文件缩减为 66 行项目模型、命令、路由、证据与授权契约 |
| P6 对抗性验证与试运行 | 完成 | `npm run check`、Skill 校验、forward dry-run 与 Standards/Spec 双轴审查均完成 |

## 当前保护状态

- 工作分支：`codex/refactor-workflow-assets`
- 分支创建前已有未提交修改；它们属于开发者工作区，不纳入本任务提交。
- 工作期间出现并发提交 `eb288ae`；其中包含本任务 P2 的 `package.json` 与锁文件改动，
  也包含不属于本任务的 Vditor 改造。为保护他人工作，本任务未重写该提交。
- 本面板记录状态、产物和验证证据；commit 列表由最终 record 统一记录。
