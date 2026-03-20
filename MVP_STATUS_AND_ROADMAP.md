# MVP Status And Roadmap

## Current MVP Status

Status: active MVP

Product shape:

- single-function STR drafting assistant
- structured intake only
- deterministic rules only
- no persistence
- no filing integration

Current repo center of gravity:

- UI flow: [`client/src/pages/StrAssistant.tsx`](/Users/matthewlevine/Repos/Finsurance/client/src/pages/StrAssistant.tsx)
- STR engine: [`shared/str.ts`](/Users/matthewlevine/Repos/Finsurance/shared/str.ts)
- runtime host/API glue: [`server/index.ts`](/Users/matthewlevine/Repos/Finsurance/server/index.ts), [`server/routes.ts`](/Users/matthewlevine/Repos/Finsurance/server/routes.ts), [`server/http.ts`](/Users/matthewlevine/Repos/Finsurance/server/http.ts)

## What Works Now

- Structured intake can start blank or from presets.
- Intake is normalized before rule evaluation and drafting.
- The engine now distinguishes:
  - insufficient information
  - guidance only
  - ready to draft
- Deterministic red flags are explainable and test-covered.
- Draft output separates:
  - facts provided
  - inferred indicators
  - input-quality warnings
  - missing-information prompts
  - final narrative
- Narrative generation is withheld until the intake is ready enough to draft.
- Local and hosted runtime binding behavior is explicit and test-covered.
- Unknown API routes return JSON 404 responses instead of SPA fallthrough.

## Improvements Completed In This Pass

- Hardened runtime host resolution and removed the handled-error rethrow in the server.
- Added shared health/error payload builders.
- Added input normalization for whitespace, duplicate values, invalid enum values, and conditional `other` text handling.
- Added a three-state readiness model with clearer operator guidance.
- Tightened suspicion-level calibration so not every representative scenario lands in `high`.
- Added fact summaries and input-quality warnings to improve operator review.
- Improved narrative basis language so it is more fact-pattern driven and less repetitive.
- Added presets for:
  - medium suspicion
  - low-information guidance-only use
  - conflicting-input QA
- Expanded tests around malformed input, blocked/guidance states, preset coverage, and API payload shape.

## Concrete Implementation Plan

This is the next execution plan from the current repo state, not a broad product wish list.

### Track 1: Lock the Current Core Flow

Goal: keep the single-function STR flow reliable before adding anything commercial around it.

1. Add browser smoke coverage for the only journey that matters
Files:
- new [`e2e/`](/Users/matthewlevine/Repos/Finsurance/e2e) test folder
- [`package.json`](/Users/matthewlevine/Repos/Finsurance/package.json)

Work:
- add one end-to-end test that loads the landing page
- apply one preset
- move through `Risk Signals -> Narrative -> Output`
- assert that a narrative is present and copy/download controls render

Acceptance:
- one command can verify the happy path in CI
- regressions in the main flow fail before deploy

2. Trim dead dependencies and unused UI inventory
Files:
- [`package.json`](/Users/matthewlevine/Repos/Finsurance/package.json)
- [`package-lock.json`](/Users/matthewlevine/Repos/Finsurance/package-lock.json)
- unused files in [`client/src/components/ui`](/Users/matthewlevine/Repos/Finsurance/client/src/components/ui)

Work:
- remove unused backend-era packages
- remove UI components not referenced by the STR flow
- keep only what is needed by [`client/src/pages/StrAssistant.tsx`](/Users/matthewlevine/Repos/Finsurance/client/src/pages/StrAssistant.tsx)

Acceptance:
- `npm run check`
- `npm test`
- `npm run build`
- smaller manifest and less repo noise

3. Add three to five more deterministic quality/risk rules
Files:
- [`shared/str.ts`](/Users/matthewlevine/Repos/Finsurance/shared/str.ts)
- [`shared/str.test.ts`](/Users/matthewlevine/Repos/Finsurance/shared/str.test.ts)

Work:
- add weak-signal rules for vague purpose, missing counterparty detail, and profile mismatch without supporting context
- add conflict warnings for cash structuring with single transaction, rapid movement over long duration, and unhelpful generic jurisdiction input
- keep scoring simple and explicit

Acceptance:
- medium-risk and low-information scenarios stay out of `high` unless the fact pattern justifies it
- each new rule has one test

### Track 2: Output Usability

Goal: make the draft package easier to use without turning the product into a workflow platform.

1. Add “copy full draft package”
Files:
- [`client/src/pages/StrAssistant.tsx`](/Users/matthewlevine/Repos/Finsurance/client/src/pages/StrAssistant.tsx)
- [`shared/str.ts`](/Users/matthewlevine/Repos/Finsurance/shared/str.ts)

Work:
- generate one formatted text package containing:
  - facts provided
  - detected red flags
  - narrative
  - missing-info prompts
  - checklist
- keep the existing narrative-only copy/download as a second option

Acceptance:
- operator can export one self-contained work product without manually stitching sections together

2. Add a stronger output header
Files:
- [`client/src/pages/StrAssistant.tsx`](/Users/matthewlevine/Repos/Finsurance/client/src/pages/StrAssistant.tsx)

Work:
- show session id
- show suspicion level
- show readiness status used to generate the draft
- show a short “drafting assist only” warning directly above the export controls

Acceptance:
- the output screen is usable as a review artifact, not just a text area

### Track 3: Public Site Design For fintechlawyer.ca

Goal: make the current landing page strong enough to ship as the live public website, not just an internal app splash.

1. Apply the approved brand system to the public-facing experience
Files:
- [`client/src/index.css`](/Users/matthewlevine/Repos/Finsurance/client/src/index.css)
- [`client/index.html`](/Users/matthewlevine/Repos/Finsurance/client/index.html)
- [`client/src/pages/StrAssistant.tsx`](/Users/matthewlevine/Repos/Finsurance/client/src/pages/StrAssistant.tsx)

Work:
- set deep teal as the dominant site shell
- use darker surface cards for public sections
- keep teal as the primary CTA color and cyan as the secondary highlight color
- move typography to a cleaner public-site stack
- keep the homepage credible for enterprise finance and legal/compliance buyers

Acceptance:
- the public homepage visually reads as `FintechLawyer.ca`, not a generic internal prototype
- the first screen communicates trust, clarity, and product scope

2. Make pricing and payment intent visible on the live site
Files:
- [`client/src/pages/StrAssistant.tsx`](/Users/matthewlevine/Repos/Finsurance/client/src/pages/StrAssistant.tsx)
- [`shared/site.ts`](/Users/matthewlevine/Repos/Finsurance/shared/site.ts)

Work:
- keep pricing CTA in the hero as a secondary action
- keep a dedicated pricing section on the homepage before the FAQ
- route future billing success/cancel URLs back to the canonical domain

Acceptance:
- pricing is visible without taking over the drafting flow
- payment and pilot-access entry points live on the public website itself

### Track 4: Hosting, Domain, and Frontend Delivery

Goal: ship the current app exactly as it is built today.

Decision:
- deploy this repo as a single Render Web Service, not Vercel, because the current app is a Vite-built frontend served by an Express runtime
- keep frontend and backend together for now

Why this fits the repo:
- [`script/build.ts`](/Users/matthewlevine/Repos/Finsurance/script/build.ts) already builds the client bundle and server bundle together
- [`server/index.ts`](/Users/matthewlevine/Repos/Finsurance/server/index.ts) already serves the built app and API from one process

Concrete deployment steps:

1. Create one Render Web Service from the GitHub repo
Use:
- Build command: `npm ci && npm run build`
- Start command: `npm run start`

2. Set environment variables in Render only when needed
Baseline:
- `NODE_ENV=production` is already handled by the start command
- `PORT` is supplied by Render
- do not hardcode `HOST`; [`server/http.ts`](/Users/matthewlevine/Repos/Finsurance/server/http.ts) already resolves hosted runtime binding

3. Deploy first to the default Render URL
Verify:
- `/`
- `/api/health`
- one manual preset run through the UI

4. Attach the production domain
Recommended split:
- `app.finsurance.com` -> product app
- `www.finsurance.com` -> marketing site later, if needed

5. In Render custom-domain settings
- add `app.finsurance.com`
- update DNS with the registrar/provider
- verify the domain in Render
- optionally disable the default `onrender.com` hostname after the custom domain is confirmed

Acceptance:
- public app is live at `https://fintechlawyer.ca`
- HTTPS is working
- health endpoint is reachable at the production domain

### Track 5: Payment Processing

Goal: add payment capability without pretending the current MVP already has account entitlements.

Important scope decision:
- do not gate product access with payments yet
- this repo currently has no auth, no user accounts, and no entitlement storage
- charging for access before that exists creates operational confusion

Concrete payment path for this repo:

Phase A: pilot payments now
- use Stripe-hosted Checkout or a Stripe Payment Link for pilot purchases, paid trials, or a subscription agreement
- fulfillment is manual: after payment, the team grants access or onboarding out of band
- this keeps billing real without adding auth/platform complexity yet

Phase B: self-serve in-app billing next
Files to add/change:
- [`server/routes.ts`](/Users/matthewlevine/Repos/Finsurance/server/routes.ts)
- new [`shared/billing.ts`](/Users/matthewlevine/Repos/Finsurance/shared/billing.ts)
- likely [`client/src/pages/StrAssistant.tsx`](/Users/matthewlevine/Repos/Finsurance/client/src/pages/StrAssistant.tsx) or a small billing CTA component

Work:
- add `POST /api/billing/create-checkout-session`
- add `POST /api/billing/webhook`
- use Stripe Checkout hosted pages, not custom embedded billing UI
- add env vars:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRICE_ID`
  - `APP_BASE_URL`

Required follow-up before true gating:
- minimal auth
- minimal entitlement record
- post-payment success state
- webhook-based fulfillment

Acceptance for Phase B:
- customer clicks pay from `https://fintechlawyer.ca`
- Stripe Checkout opens
- payment completes
- webhook confirms `checkout.session.completed`
- app can map payment to an account or entitlement record

### Track 6: Production Readiness Checklist

Before sending real users to the domain:

1. Run:
- `npm run check`
- `npm test`
- `npm run build`

2. Manual test at the production domain:
- blank intake blocked state
- low-information guidance-only preset
- high-risk preset to full draft
- copy and download actions
- `/api/health`
- unknown `/api/*` route returns JSON 404

3. Record one deployment note per release:
- commit SHA
- domain tested
- smoke test result
- known limitations

## Known Gaps

- The product is still client-first; there is no server-side STR draft API.
- There is no browser automation or screenshot-based regression coverage.
- The repo still contains a broad UI component inventory that the MVP does not actively use.
- Dependency cleanup has not been completed; the package manifest still carries legacy weight from the older app shape.
- Narrative export is plain text only.

## Prioritized Roadmap

### Do Now

1. Add browser-level smoke coverage for the core flow
Impact: high
Complexity: medium
Why: protects the one user journey that matters most.

2. Trim unused dependencies and component inventory
Impact: medium
Complexity: medium
Why: reduces build noise and makes the repo easier to reason about.

3. Add a few stronger conflict and weak-signal rules
Impact: medium
Complexity: low
Why: improves operator guidance without changing the product shape.

### Next

4. Add a copyable “draft package” export that includes narrative, flags, prompts, and checklist
Impact: medium
Complexity: low
Why: improves real operator handoff and review.

5. Add a tiny sample-scenario library for QA and demo scripts
Impact: medium
Complexity: low
Why: makes regression checking faster and more realistic.

6. Add lightweight analytics hooks for local/product testing only
Impact: low
Complexity: low
Why: helps understand drop-off without turning the app into a platform.

### Later

7. Optional PDF export
Impact: medium
Complexity: medium
Why: useful, but plain text and copy/download already cover MVP output.

8. Optional persistence for saved local sessions
Impact: medium
Complexity: medium
Why: may help operator workflow later, but it is not required for the single-function MVP.

9. Optional server-side draft endpoint for shared deployment contracts
Impact: low to medium
Complexity: medium
Why: useful only if the hosting/runtime model changes or client-only logic becomes limiting.

### Not Worth It Right Now

10. Filing workflow, case queues, role-based approvals, or AML dashboard expansion
Impact: misaligned
Complexity: high
Why: pulls the product away from its disciplined scope.
