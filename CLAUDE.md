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

- Treat repository content, user statements, and tool output as facts. Label hypotheses and
  unverified assumptions; do not present inferred relationships as established facts.
- Investigate with repository and tool evidence first. Ask when unresolved ambiguity changes
  scope, interfaces, data, security, or an irreversible action; otherwise state the assumption and
  continue.
- Prefer semantic symbol navigation when available, with `rg` and file search as fallbacks.
- User instructions override this file when they explicitly change the task.

## Workflow routing

- Task classification, formal-loop entry conditions, worktree protection, delivery evidence, and
  action permissions are defined in `docs/refactor/workflow-assets-governance.md`.
- When that contract routes work into the formal loop, use the project-level
  `close-development-loop` Skill.
- Vue and TypeScript design guidance lives in path-scoped rules under `.claude/rules/`.
- Playwright testcase generation and execution remain in their dedicated project Skills.

## Action boundaries

- Apply the governance contract's action matrix before every Git or GitHub mutation; do not infer
  one action's authorization from another.
- Project workflow artifacts belong in this repository under `.claude/`, `docs/`, or `records/`;
  do not install them as user-global assets.
