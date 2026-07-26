---
paths:
  - "**/*.vue"
---

# Vue design rules

- Use `<script setup lang="ts">` for new and substantially edited SFCs.
- Extract a component when it creates a meaningful behavioral, reuse, testing, or ownership boundary. Keep one-off markup local when extraction only adds indirection.
- Keep state local by default. Use props and emits for direct ownership relationships; use Pinia or another shared abstraction when state is genuinely shared across distant components or routes.
- Define public props and emits with explicit TypeScript contracts. Model optional values and defaults deliberately.
- Keep event handlers focused on one user intent. Move reusable domain or side-effect logic into a composable or service instead of growing the component script.
- Prefer existing layout and UI primitives under `src/components/` before creating a parallel abstraction.
- Scope component styles by default. Use global styles only for intentional application-wide tokens, resets, or third-party overrides.
- Let ESLint and `vue-tsc` own syntax, unused bindings, template validity, and type correctness; do not duplicate those checks as prose rules.
