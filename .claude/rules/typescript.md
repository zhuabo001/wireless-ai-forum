---
paths:
  - "**/*.{ts,vue}"
---

# TypeScript design rules

- Make types explicit at public boundaries: component props and emits, exported functions, external inputs, shared state, and complex return values.
- Prefer inference for obvious local variables and expressions; annotations should clarify contracts rather than restate the compiler.
- Treat external or untrusted values as `unknown` and narrow them before use. Isolate unavoidable unsafe integration code behind a typed adapter.
- Model state variants with discriminated unions or precise domain types instead of loosely related booleans and optional fields.
- Prefer reusable domain types from `src/types/` over parallel inline shapes when they represent the same concept.
- Avoid assertions that bypass evidence. When an assertion is necessary, keep it narrow and make the runtime invariant visible.
- Keep functions focused and return values predictable. Separate parsing, validation, state mutation, and presentation when they change for different reasons.
- Let ESLint and `vue-tsc` own machine-checkable syntax and type rules; this file governs design decisions they cannot determine reliably.
