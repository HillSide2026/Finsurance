# FinSure

FinSure is a focused STR drafting assistant. It converts a structured suspicious activity scenario into:

- deterministic red flags
- a calibrated suspicion-strength assessment
- a FINTRAC-oriented STR narrative draft
- missing-information prompts
- a lightweight compliance checklist

It is intentionally narrow. This repo is not a case-management system, collaboration suite, filing platform, or general AML portal.

## MVP Flow

`Landing -> Intake -> Risk Signals -> Narrative -> Output`

The product supports:

- blank starts
- scenario presets
- customer-data capture
- deterministic rules
- editable narrative output
- copy/download workflow
- full draft package export

## Architecture

- Frontend: public site pages plus the main STR flow in [`client/src/pages/StrAssistant.tsx`](/Users/matthewlevine/Repos/Finsurance/client/src/pages/StrAssistant.tsx)
- Shared engine: intake normalization, readiness, rules, presets, narrative assembly, and checklist generation in [`shared/str.ts`](/Users/matthewlevine/Repos/Finsurance/shared/str.ts)
- Server: Express host in [`server/index.ts`](/Users/matthewlevine/Repos/Finsurance/server/index.ts)
- API surface: auth, saved drafts, enquiries, billing, health, and JSON API 404 handling in [`server/routes.ts`](/Users/matthewlevine/Repos/Finsurance/server/routes.ts)
- Persistence: file-backed app store resolved from `APP_DATA_PATH` or `data/app-store.json` in [`server/persistence.ts`](/Users/matthewlevine/Repos/Finsurance/server/persistence.ts)
- Runtime helpers: listen configuration and API payload builders in [`server/http.ts`](/Users/matthewlevine/Repos/Finsurance/server/http.ts)
- Build: Vite client build plus bundled server output in [`script/build.ts`](/Users/matthewlevine/Repos/Finsurance/script/build.ts)

## STR Engine Model

The STR engine is deterministic and explainable.

1. Intake is normalized and malformed values are filtered.
2. Readiness is classified as:
   - `insufficient_information`
   - `guidance_only`
   - `ready_to_draft`
3. Hardcoded red-flag rules fire from the structured scenario.
4. The engine separates:
   - facts provided
   - inferred red flags
   - input-quality warnings
   - missing-information prompts
   - final narrative output
5. A narrative is assembled only when the intake is `ready_to_draft`.

## Run

- `npm run dev`
- `npm run check`
- `npm test`
- `npm run test:e2e`
- `npm run build`
- `HOST=127.0.0.1 npm run start`

Browser smoke coverage:

- `npm run test:e2e` exercises:
  - `Landing -> Preset -> Risk Signals -> Narrative -> Output`
  - `Landing -> Low-Information Preset -> Guidance-Only Review`
- Playwright uses an isolated `APP_DATA_PATH` so browser tests do not write into the local app store
- first-time Playwright setup may require `npx playwright install chromium`

## Persistence

- Local development defaults to `data/app-store.json` when `APP_DATA_PATH` is not set.
- Set `APP_DATA_PATH` explicitly if you want the app store somewhere else on your machine.
- The file-backed store currently holds account records, sessions, drafts, enquiries, Stripe checkout records, webhook receipts, and audit events.
- Browser e2e tests use a separate `APP_DATA_PATH` so they do not pollute local working data.
- In deployment, set `APP_DATA_PATH` to a writable persistent location. If the runtime filesystem is ephemeral, saved drafts and related records will not survive restarts.
- The checked-in Render config mounts a persistent disk at `/var/data` and points `APP_DATA_PATH` to `/var/data/app-store.json`.
- Draft writes are persisted atomically so a successful save response reflects data that has already been written to disk.

## Runtime Assumptions

- Local default bind host is `127.0.0.1`.
- Hosted runtimes bind to `0.0.0.0` automatically when common hosted-environment variables are present, or when `HOST` / `LISTEN_HOST` is explicitly set.
- The current API surface includes:
  - `GET /api/health`
  - auth session, register, login, and logout routes
  - saved-draft listing and draft save/load/export routes
  - enquiry and billing routes
  - unknown `/api/*` routes return JSON 404s instead of SPA HTML
- Persistence is file-backed through `APP_DATA_PATH`.
- Session-based account access is part of the current MVP.

## Current Scope

In scope:

- suspicious activity scenario intake
- red-flag identification
- readiness guidance
- STR narrative drafting
- operator follow-up prompts

Out of scope:

- filing integration
- workflow orchestration
- audit logs
- MLRO tasking
- multi-user collaboration
- multi-report case management
- regulatory decision automation

## Stage Boundary

Stage 1 is the public MVP for `https://fintechlawyer.ca`.

Stage 1 is not defined as a local-only workflow. It is complete only when an external user can open the live domain and use the product directly.

Stage 2 items are intentionally out of scope for the current MVP. They can be planned, but they are not current build requirements.
