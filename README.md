# FinSure

FinSure is a focused STR drafting assistant. It converts a structured suspicious activity scenario into:

- deterministic red flags
- a calibrated suspicion-strength assessment
- a FINTRAC-oriented STR narrative draft
- missing-information prompts
- a lightweight compliance checklist

It is intentionally narrow. This repo is not a case-management system, filing platform, or general AML portal.

## MVP Flow

`Landing -> Intake -> Risk Signals -> Narrative -> Output`

The product supports:

- blank starts
- scenario presets
- customer-data capture
- deterministic rules
- editable narrative output
- copy/download workflow

## Architecture

- Frontend: a single React flow in [`client/src/pages/StrAssistant.tsx`](/Users/matthewlevine/Repos/Finsurance/client/src/pages/StrAssistant.tsx)
- Shared engine: intake normalization, readiness, rules, presets, narrative assembly, and checklist generation in [`shared/str.ts`](/Users/matthewlevine/Repos/Finsurance/shared/str.ts)
- Server: Express host in [`server/index.ts`](/Users/matthewlevine/Repos/Finsurance/server/index.ts)
- API surface: health endpoint and JSON API 404 handling in [`server/routes.ts`](/Users/matthewlevine/Repos/Finsurance/server/routes.ts)
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
- `npm run build`
- `HOST=127.0.0.1 npm run start`

## Runtime Assumptions

- Local default bind host is `127.0.0.1`.
- Hosted runtimes bind to `0.0.0.0` automatically when common hosted-environment variables are present, or when `HOST` / `LISTEN_HOST` is explicitly set.
- The current API surface is intentionally small:
  - `GET /api/health`
  - unknown `/api/*` routes return JSON 404s instead of SPA HTML
- There is no persistence in the MVP.
- There is no login or user management in the MVP.

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
- multi-report case management
- regulatory decision automation
