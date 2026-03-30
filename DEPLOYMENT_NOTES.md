# Deployment Notes

## 2026-03-29 Release

- Commit SHA: `17e16e5`
- Domain tested: `https://fintechlawyer.ca`
- Production deploy observed live: `2026-03-30T00:16:33Z`
- Acceptance checked at: `2026-03-30T00:28:13.358Z`
- Smoke result: `pass_with_known_limitations`

Release scope:
- aligned public-site metadata from `FinTech Teams` to `FinTech Operators`
- added a stronger third-party cross-border STR rule
- added sharper warnings for generic high-risk-jurisdiction and under-described third-party inputs
- added a reusable production acceptance script at [`script/production-acceptance.mjs`](/Users/matthewlevine/Repos/Finsurance/script/production-acceptance.mjs)

Verification:
- `npm run check`
- `npm test`
- `npm run build`
- `npm run acceptance:prod`

Production acceptance results:
- blank intake blocked state: pass
- low-information guidance-only path: pass
- high-risk preset to final draft: pass
- `GET /api/health`: pass
- unknown `/api/*` JSON 404 behavior: pass
- copy/download actions: limited

Known limitations:
- Copy/download actions were not fully exercised on production because the current UI only exposes them after payment confirmation or an already-unlocked draft.
- If Stage 1 closure requires a live-domain check of those controls, the product still needs either:
  - a dedicated unlocked smoke-test draft
  - a non-billable release-verification path
  - or a deliberate paid smoke-check procedure
