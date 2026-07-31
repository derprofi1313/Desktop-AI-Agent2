# Security Policy

## Reporting Vulnerabilities

Please report security issues through GitHub private vulnerability reporting for
this repository. Do not create a public issue for a suspected vulnerability.

Include:

- the affected file or boundary, such as `lib/actionPolicy.js`,
  `Pages/Desktop`, or `Components/Desktop/BrowserWindow`;
- a minimal reproduction or payload;
- the expected and observed behavior;
- any host-runtime assumptions required to reproduce the issue.

## Areas of Interest

Reports are especially useful when they involve:

- action-policy bypasses for `CREATE`, `UPDATE`, `DELETE`, `READ`,
  `OPEN_BROWSER`, or `NONE`;
- prompt-injection paths that cause model-selected actions to skip validation
  or user confirmation;
- SSRF, DNS rebinding, credentialed URL, loopback, private-address, non-HTTPS,
  redirect, or port-handling issues in browser navigation;
- iframe sandbox or referrer-policy regressions;
- unsafe persistence of hidden model reasoning or untrusted model output.

Client-side URL validation is defense in depth. If a host platform proxies,
prefetches, screenshots, or otherwise fetches user-selected URLs, that host must
also enforce server-side destination checks before every outbound connection and
before following redirects.

## Supported Versions

Security fixes are considered for the current `main` branch. If tagged releases
are added later, this policy should be updated with supported version ranges.
