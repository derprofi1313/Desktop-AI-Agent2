# Contributing

Thanks for helping improve Desktop AI Agent 2. This repository is a
host-integrated React source snapshot, not a standalone application, so changes
should preserve the host boundary described in the README.

## Development Setup

Use Node.js 22.12 or newer.

```bash
npm ci
npm test
```

The test suite uses `node --test` and has no third-party runtime test
framework. Add focused tests under `tests/` when changing policy logic or
host-integration assumptions.

## Project Boundaries

- `Pages/Desktop` is the host page entry point.
- `Components/Desktop/*` contains host-rendered UI components.
- `Entities/*` and `@/integrations/Core` are supplied by the host platform.
- `lib/actionPolicy.js` is pure JavaScript policy code and should stay easy to
  test outside the host runtime.

Do not turn this snapshot into a standalone web app unless that is discussed in
an issue first. Runtime behavior should remain deterministic around model
actions: model output is untrusted input and must pass validation before any UI
side effect.

## Pull Requests

Before opening a pull request:

- run `npm test`;
- run `npm audit --audit-level=high` when dependency metadata changes;
- update README or security documentation when trust boundaries change;
- keep diffs focused and avoid unrelated formatting churn.

For security-sensitive changes, include tests for action-policy behavior,
prompt-injection resistance, URL normalization, confirmation requirements, or
iframe restrictions as applicable.

## Reporting Issues

Use the bug report template for reproducible defects. For vulnerabilities or
suspected bypasses, do not open a public issue; use GitHub private vulnerability
reporting as described in `SECURITY.md`.
