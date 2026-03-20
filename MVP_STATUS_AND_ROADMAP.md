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

## Stage Boundary

Stage 1 is the current MVP.

Everything listed in the Stage 2 section below is explicitly out of scope for Stage 1 / the current MVP. Stage 2 items can be planned, but they are not current build requirements.

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
- Output can now be exported as either:
  - the narrative only
  - a full draft package with facts, flags, narrative, follow-up prompts, and checklist
- Narrative generation is withheld until the intake is ready enough to draft.
- Local and hosted runtime binding behavior is explicit and test-covered.
- Unknown API routes return JSON 404 responses instead of SPA fallthrough.
- One browser smoke path now covers:
  - landing
  - preset application
  - risk review
  - narrative build
  - final output
- The dependency manifest and UI component inventory are now trimmed to the current Stage 1 app.

## Improvements Completed In This Pass

- Hardened runtime host resolution and removed the handled-error rethrow in the server.
- Added shared health/error payload builders.
- Added input normalization for whitespace, duplicate values, invalid enum values, and conditional `other` text handling.
- Added a three-state readiness model with clearer operator guidance.
- Tightened suspicion-level calibration so not every representative scenario lands in `high`.
- Added fact summaries and input-quality warnings to improve operator review.
- Improved narrative basis language so it is more fact-pattern driven and less repetitive.
- Added a full draft package formatter so the operator can export one self-contained work product instead of manually stitching sections together.
- Strengthened output usability with:
  - session context
  - readiness status
  - suspicion strength
  - full-package export controls
- Added deterministic coverage for:
  - rapid movement through new relationships
  - cash-to-electronic movement patterns
  - high-value profile mismatch
- Added sharper guidance where the intake still lacks:
  - onboarding expectation detail
  - origin and destination detail
  - stated transaction purpose or commercial rationale
- Added presets for:
  - medium suspicion
  - low-information guidance-only use
  - conflicting-input QA
- Expanded tests around malformed input, blocked/guidance states, preset coverage, and API payload shape.

## Product/App Focus Completed In This Pass

This pass deliberately focused on the next two product steps instead of adding more platform surface area.

### Step 1: Make the output usable as a real draft package

Necessary work:
- add a shared formatter for a full STR package export
- preserve the operator-edited narrative inside that package
- keep narrative-only export as a secondary option
- show session, readiness, and suspicion context directly on the output screen
- test the package formatter so export structure stays stable

Status: completed

### Step 2: Tighten deterministic rules and operator guidance

Necessary work:
- add rules for rapid movement through a new relationship
- add rules for cash activity followed by electronic movement
- add rules for high-value activity that materially exceeds the stated profile
- add warnings when the intake is missing onboarding expectation detail
- add warnings when origin/destination detail is absent from rapid or cross-border fact patterns
- add warnings when the stated transaction purpose or rationale is still not captured
- add follow-up prompts that specifically address cash-to-electronic movement and onboarding context
- test the new rule and warning coverage directly

Status: completed

## Concrete Implementation Plan

This is the next execution plan from the current repo state, not a broad product wish list.

### Track 1: Lock the Current Core Flow

Goal: keep the single-function STR flow reliable before adding anything commercial around it.

Completed in this pass:
- one browser smoke test now exercises `Landing -> Preset -> Risk Signals -> Narrative -> Output`
- the landing page now exposes a workflow entry point so the real user path is testable
- unused backend-era dependencies were removed from the manifest
- unused shadcn/ui inventory was removed so the repo matches the current STR app
- the server build allowlist was reduced to the runtime dependency actually used by the app

### Track 2: Output Usability

Goal: make the draft package easier to use without turning the product into a workflow platform.

Completed in this pass:
- full draft package copy/download
- preserved edited narrative in exports
- stronger output context with session, readiness, suspicion level, and drafting-assist warning

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
- use a split hero with:
  - primary CTA: early access
  - secondary CTA: start the workflow
  - tertiary authority link: Levine Law
- add a clear problem/agitation section instead of internal “site posture” copy
- add a product-value section focused on benefits, not features
- add a Levine Law authority bridge that supports trust without taking over the page
- end the homepage with a working early-access capture form

Acceptance:
- the public homepage visually reads as `FintechLawyer.ca`, not a generic internal prototype
- the first screen communicates trust, clarity, and product scope
- the homepage ends with a clear conversion path instead of only navigation links

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

## Next Product/App Steps

These are the next two product-facing steps after the work completed in this pass.

1. Add one more browser smoke test for the blocked / guidance-only path
Necessary work:
- start from the landing page
- enter the workflow
- apply the low-information preset
- assert that the user can review risk signals but cannot build a narrative
- assert that required-gap guidance is visible

2. Tighten the landing-to-workflow product path without bloating the homepage
Necessary work:
- keep the marketing hierarchy intact
- make the workflow entry point obvious enough for real users
- avoid reintroducing dashboard clutter or internal-product copy
- validate that the flow remains easy to find on desktop

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

## Stage 1 Known Gaps

- The product is still client-first; there is no server-side STR draft API.
- Narrative export is plain text only.
- There is only one browser smoke path today; blocked/guidance-only coverage is still manual.
- The landing-to-workflow path is now present, but it still needs design refinement.

## Stage 1 Prioritized Roadmap

### Do Now

1. Add one more browser smoke test for the blocked / guidance-only path
Impact: high
Complexity: low
Why: protects the second-most-important product path without adding platform complexity.

2. Tighten the landing-to-workflow product path
Impact: medium
Complexity: low
Why: the product is only as usable as the path into the workflow.

3. Add a few stronger conflict and weak-signal rules
Impact: medium
Complexity: low
Why: improves operator guidance without changing the product shape.

### Next

4. Add a tiny sample-scenario library for QA and demo scripts
Impact: medium
Complexity: low
Why: makes regression checking faster and more realistic.

5. Add lightweight analytics hooks for local/product testing only
Impact: low
Complexity: low
Why: helps understand drop-off without turning the app into a platform.

### Later

6. Optional PDF export
Impact: medium
Complexity: medium
Why: useful, but plain text and copy/download already cover MVP output.

7. Optional persistence for saved local sessions
Impact: medium
Complexity: medium
Why: may help operator workflow later, but it is not required for the single-function MVP.

8. Optional server-side draft endpoint for shared deployment contracts
Impact: low to medium
Complexity: medium
Why: useful only if the hosting/runtime model changes or client-only logic becomes limiting.

### Not Worth It Right Now

9. Filing workflow, case queues, role-based approvals, or AML dashboard expansion
Impact: misaligned
Complexity: high
Why: pulls the product away from its disciplined scope.

## Stage 2 Roadmap

Everything in this section is explicitly out of scope for Stage 1 / the current MVP.

1. Self-serve billing and entitlement checks
Why it matters:
- converts pilot access into a real commercial flow
- prevents manual post-payment fulfillment from becoming operational drag

2. Saved sessions and return-to-draft workflow
Why it matters:
- supports multi-step review across longer internal compliance processes
- allows operators to resume work without rebuilding the fact pattern from scratch

3. PDF / document-grade export package
Why it matters:
- makes the output easier to circulate internally
- supports teams that need a more formal handoff artifact than plain text

4. Server-side draft generation endpoint
Why it matters:
- creates a cleaner deployment contract if the client-first model becomes limiting
- supports future entitlement, auditing, or versioning layers

5. Structured product analytics and funnel instrumentation
Why it matters:
- shows where users abandon the flow
- helps improve conversion without guessing

6. CRM or lead-routing integration for early access and paid pilots
Why it matters:
- turns interest capture into a real follow-up pipeline
- reduces manual handling of inbound requests

7. Organization-level access and account management
Why it matters:
- supports teams rather than one-off users
- creates the foundation for billing, saved work, and controlled access
