# Desktop AI Agent 2

A host-integrated React source snapshot for a virtual desktop assistant. The
agent can propose virtual file operations, open files, and navigate an embedded
browser while deterministic application code controls what may actually run.

## Safety boundary

Model output is treated as untrusted input:

- every action is allow-listed and structurally validated;
- file names cannot contain paths or control characters;
- updates, deletes, and reads must target an existing virtual file;
- file content and response sizes are bounded;
- create, update, delete, and external navigation require explicit user
  confirmation;
- browser navigation accepts HTTPS on the default port only and blocks
  credentials plus literal loopback, private-address, and local host names;
- the embedded frame omits same-origin and popup privileges and sends no
  referrer;
- hidden model reasoning is neither requested nor persisted.

The policy lives in [`lib/actionPolicy.js`](lib/actionPolicy.js) and is covered
by executable regression tests.

## Verification

Node.js 22.12 or newer is sufficient; the test suite has no third-party
packages.

```bash
npm ci
npm test
```

CI repeats the tests on Node.js 22.12 and 24 with read-only repository
permissions, commit-pinned setup actions, and a committed lockfile.

## Community

- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [MIT License](LICENSE)

## Host integration

This repository is intentionally not a standalone web application. The page
expects its host platform to provide:

- `@/entities/DesktopFile`
- `@/entities/AgentMemory`
- `@/integrations/Core`
- the `@/components/ui/*` primitives
- React, Tailwind CSS, and `lucide-react`

`Pages/Desktop` is the page entry point and `Layout.js` is the surrounding
layout. A production deployment must supply those integrations and should add
host-level end-to-end tests for persistence, confirmation dialogs, and iframe
behavior. The included Node suite proves the pure policy logic and statically
checks the critical integration wiring; it does not execute React or pretend to
emulate the proprietary host runtime.

Client-side hostname checks are defense in depth, not complete SSRF or DNS
rebinding protection. A host that proxies or prefetches URLs must resolve the
destination at a trusted server boundary, reject private/reserved results
before every connection, and avoid following redirects across that boundary.
