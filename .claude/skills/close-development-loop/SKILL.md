---
name: close-development-loop
description: Close a formal development request through scoped planning, milestone implementation, evidence-backed validation, authorized local commits, independent verification, human acceptance, and a final record. Use only when the user explicitly requests this closed-loop workflow for a multi-file or high-risk change with multiple acceptance criteria.
---

# Close Development Loop

Use this project-level delivery loop for L2 and L3 work. Read
`../../../docs/refactor/workflow-assets-governance.md` before creating artifacts; it is the
authority for task levels, evidence, and action permissions.

## 1. Establish scope

Inspect repository instructions, the working tree, the request, and any existing plan. Apply the
governance contract's task classification and exit this Skill when the formal loop does not apply.

For L2/L3, identify the intended files, acceptance criteria, constraints, existing user changes,
and unverified assumptions. Ask only when an unresolved choice changes scope, interfaces, data,
security, or an irreversible action.

Completion criterion: the task level, scope, acceptance criteria, protected user changes, and
effective plan source are explicit.

## 2. Create or locate delivery artifacts

Use the user-provided plan when available. Otherwise create a focused plan under `docs/` from the
confirmed request. Create its sibling progress file from
[`assets/progress-template.md`](assets/progress-template.md), named `<plan-stem>-progress.md`.

List milestones as pending and record their expected outputs and verification. Keep commit hashes
out of progress; the final record owns the commit list.

Completion criterion: one authoritative plan and one progress file exist, and every acceptance
criterion maps to at least one milestone.

## 3. Implement one milestone

Mark only the current milestone in progress. Make the smallest coherent change that satisfies it.
Use test-first development when a stable behavioral seam exists. Apply the governance contract's
worktree protection and evidence rules throughout implementation.

Completion criterion: the milestone change matches its planned scope and contains no unrelated
modifications.

## 4. Validate and record evidence

Run the narrowest relevant checks during implementation. Before final completion, run the
project-level quality entrypoint:

```bash
npm run check
```

When validation fails, keep the milestone incomplete. Reproduce the failure, establish a root-cause
hypothesis, test it, fix the cause, and rerun the failed check plus relevant regression coverage.
Record commands, results, remaining risks, and unverified items in progress.

Completion criterion: every validation result is recorded and all required checks for the milestone
pass.

## 5. Create an authorized local milestone commit

Apply the governance contract's action matrix. When it permits a local milestone commit, resolve
exact files and hunks before staging. If task-scoped changes cannot be isolated safely, leave the
milestone uncommitted and report why. Treat every other Git or GitHub mutation as a separate action
whose authorization must be checked independently.

Completion criterion: either a scoped local commit exists or progress records the concrete reason
the commit was safely skipped.

## 6. Independently verify

Use a separate reviewer when the environment supports one; otherwise perform a fresh checklist pass
without relying on the implementation narrative. Compare the plan, diff, validation evidence,
authorization boundaries, and working-tree protection. Resolve Critical and Important findings,
then repeat affected checks.

Completion criterion: every acceptance criterion is accounted for and no unresolved Critical or
Important finding remains.

## 7. Request human acceptance

Present the implemented scope, validation evidence, known limitations, and any skipped commit.
Pause for human acceptance. Treat requested changes as new incomplete milestones and resume at
Step 3.

Completion criterion: the user explicitly accepts the result.

## 8. Write the final record

Create `records/<task-slug>-<YYYY-MM-DD>.md` from
[`assets/record-template.md`](assets/record-template.md). Summarize the objective, changed files,
validation, local commits, impacts, unresolved risks, and acceptance. Mark the progress file fully
complete only after the record is accurate.

Completion criterion: plan, progress, diff, validation evidence, commit list, acceptance, and final
record agree, with no required work remaining.

## Resume and failure behavior

Resume from the first incomplete milestone in progress. Preserve recorded evidence and rerun checks
whose underlying files changed. Keep blocked or failed work visibly incomplete; never convert a
failure, missing dependency, permission gap, or unverified assumption into a completion claim.
