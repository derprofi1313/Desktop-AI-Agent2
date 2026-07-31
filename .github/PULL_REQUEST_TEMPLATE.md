## Summary

-

## Verification

- [ ] `npm test`
- [ ] `npm audit --audit-level=high` when dependency metadata changed
- [ ] Documentation updated when trust boundaries, host assumptions, or public workflow changed

## Security and Runtime Boundaries

- [ ] Model-selected actions still pass through `validateAgentAction`
- [ ] Required side effects still require explicit confirmation
- [ ] Browser navigation remains HTTPS-only and blocks local/private destinations
- [ ] I did not add persistence of hidden model reasoning or untrusted model output

## Notes

-
