---
name: Standalone JSX tests
description: Runtime distinction between Vite and tsx test rendering of React components
---

Standalone component tests run with tsx rather than Vite can use the classic JSX transform because the web project's TypeScript config preserves JSX. Components that render fine in Vite may then fail at runtime with "React is not defined" when rendered in a tsx test.

**Why:** Vite and the standalone test runtime do not share the same JSX transform configuration by default.

**How to apply:** When adding server-rendered component tests with tsx, ensure the tested JSX modules use the automatic JSX runtime pragma or configure the test transform explicitly; typechecking alone does not detect this runtime mismatch.