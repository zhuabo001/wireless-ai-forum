# Wireless AI Forum project guide

## Project model

Wireless AI Forum is a Vue 3 single-page community application for wireless AI knowledge,
discussion, courses, practices, intelligence, and an Agent marketplace.

- Stack: Vue 3, TypeScript, Vite, Vue Router, Pinia, Element Plus, Tailwind CSS, and Sass.
- Application flow: typed domain models and mock data feed route pages and home sections, which
  compose shared layout and UI components.
- Entry points: `src/main.ts`, `src/App.vue`, and `src/router/index.ts`.
- Alias: `@/*` resolves to `src/*`.

## Key paths

| Concern | Path |
| --- | --- |
| Route pages | `src/pages/` |
| Home sections | `src/sections/` |
| Shared components | `src/components/` |
| Reusable UI primitives | `src/components/ui/` |
| Static data and page configuration | `src/data/` |
| Shared and page-level types | `src/types/` |
| Router | `src/router/index.ts` |
| Global styles and tokens | `src/assets/` |
| Plans and progress | `docs/` |
| Completed delivery records | `records/` |

## Development commands

```bash
npm run dev
npm run lint
npm run type-check
npm run build
npm run check
```

Use `npm run check` as the final local quality gate. During implementation, run the narrowest
relevant check first, then the full gate before completion.

## Working contract

- Preserve existing user changes. Inspect the working tree before editing, and stage only
  task-scoped files or hunks.
- Treat repository content, user statements, and tool output as facts. Label hypotheses and
  unverified assumptions; do not present inferred relationships as established facts.
- Investigate with repository and tool evidence first. Ask when unresolved ambiguity changes
  scope, interfaces, data, security, or an irreversible action; otherwise state the assumption and
  continue.
- Prefer semantic symbol navigation when available, with `rg` and file search as fallbacks.
- User instructions override this file when they explicitly change the task.

## Workflow routing

- L0 read-only work and L1 small low-risk edits do not require plan, progress, record, or commit.
- Use the project-level `close-development-loop` Skill only when the user explicitly requests the
  formal loop for L2/L3 work.
- Vue and TypeScript design guidance lives in path-scoped rules under `.claude/rules/`.
- Playwright testcase generation and execution remain in their dedicated project Skills.
- Workflow governance and action permissions are defined in
  `docs/refactor/workflow-assets-governance.md`.

## Action boundaries

- Ordinary implementation requests do not authorize a local commit.
- Explicit use of `close-development-loop` authorizes validated, task-scoped local milestone
  commits.
- Branch creation or switching, push, PR operations, merge, deletion, and other irreversible
  actions require separate explicit user authorization.
- Project workflow artifacts belong in this repository under `.claude/`, `docs/`, or `records/`;
  do not install them as user-global assets.
