# MVP Status And Roadmap

## Current MVP Status

Status: active public MVP on the production domain, with Stage 1 close but not formally closed.

Product shape:

- single-function STR drafting assistant
- structured intake plus deterministic rules
- readiness-gated narrative generation
- editable narrative plus full draft package export
- account access, saved drafts, and file-backed persistence
- per-draft payment / export unlock flow
- no FINTRAC filing integration
- no broader AML case-management expansion

Current repo center of gravity:

- public site + product flow: [`client/src/pages/SiteHome.tsx`](/Users/matthewlevine/Repos/Finsurance/client/src/pages/SiteHome.tsx), [`client/src/pages/StrAssistant.tsx`](/Users/matthewlevine/Repos/Finsurance/client/src/pages/StrAssistant.tsx)
- STR engine: [`shared/str.ts`](/Users/matthewlevine/Repos/Finsurance/shared/str.ts)
- runtime host/API glue: [`server/index.ts`](/Users/matthewlevine/Repos/Finsurance/server/index.ts), [`server/routes.ts`](/Users/matthewlevine/Repos/Finsurance/server/routes.ts), [`server/http.ts`](/Users/matthewlevine/Repos/Finsurance/server/http.ts)
- persistence/billing: [`server/persistence.ts`](/Users/matthewlevine/Repos/Finsurance/server/persistence.ts), [`server/billing.ts`](/Users/matthewlevine/Repos/Finsurance/server/billing.ts), [`server/stripe.ts`](/Users/matthewlevine/Repos/Finsurance/server/stripe.ts)

## Stage Boundary

Stage 1 is the public MVP for `https://fintechlawyer.ca`.

Stage 1 is not defined as a local-only or internal-only workflow. It is complete only when an external user can open the live domain and use the product without manual team intervention.

Everything listed in the Stage 2 section below is explicitly out of scope for Stage 1 / the current MVP. Stage 2 items can be planned, but they are not current build requirements.

## Stage 1 Completion Criteria

Stage 1 can be marked complete only when all of the following are true:

- the app is deployed and reachable at `https://fintechlawyer.ca`
- a public user can click `Start drafting` from the homepage and enter the intake flow directly
- the browser smoke suite covers:
  - happy path to final output
  - guidance-only / blocked drafting path
- production-domain manual checks pass for:
  - blocked blank intake
  - low-information guidance-only path
  - high-risk preset to final draft
  - copy and download actions
  - `/api/health`
  - unknown `/api/*` JSON 404 behavior
- a release note is recorded with:
  - commit SHA
  - domain tested
  - smoke result
  - known limitations

## What Works Now

- The public site is live at `https://fintechlawyer.ca`.
- The homepage exposes `Start drafting` as the primary public path into the workflow.
- Structured intake can start blank or from presets.
- Intake is normalized before rule evaluation and drafting.
- The engine distinguishes:
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
- Output can be exported as either:
  - the narrative only
  - a full draft package with facts, flags, narrative, follow-up prompts, and checklist
- Narrative generation is withheld until the intake is ready enough to draft.
- Local and hosted runtime binding behavior is explicit and test-covered.
- Unknown API routes return JSON 404 responses instead of SPA fallthrough.
- The browser suite covers:
  - happy path to final output
  - guidance-only / blocked drafting path
  - guest-to-auth resume for export
  - billing-success unlock return
- Account registration, login, logout, and session-backed workspace access exist.
- Saved drafts, draft resume, export access checks, and file-backed persistence exist.
- Product funnel analytics capture and summary endpoints exist.
- Stripe Checkout creation, webhook handling, billing success return, and draft-scoped export unlock exist.
- Production acceptance can now be run with [`script/production-acceptance.mjs`](/Users/matthewlevine/Repos/Finsurance/script/production-acceptance.mjs).
- Deployment notes now exist in [`DEPLOYMENT_NOTES.md`](/Users/matthewlevine/Repos/Finsurance/DEPLOYMENT_NOTES.md).

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

Historical note:
- the track details below are preserved as the execution plan that produced the current build
- current source-of-truth gaps and priorities now live in `Stage 1 Known Gaps` and `Stage 1 Prioritized Roadmap`

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
  - primary CTA: start drafting
  - secondary authority link: Levine Law
- add a clear problem/agitation section instead of internal “site posture” copy
- add a product-value section focused on benefits, not features
- add a Levine Law authority bridge that supports trust without taking over the page
- keep any contact or update form as a secondary footer-level conversion path, not the main route into the product

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
Use:
- `fintechlawyer.ca` -> product app
- `www.fintechlawyer.ca` -> product app alias / redirect path

5. In Render custom-domain settings
- add `fintechlawyer.ca`
- add `www.fintechlawyer.ca`
- update DNS with the registrar/provider
- verify both domains in Render
- optionally disable the default `onrender.com` hostname after the custom domain is confirmed

Acceptance:
- public app is live at `https://fintechlawyer.ca`
- HTTPS is working
- health endpoint is reachable at the production domain

### Deployment Status Snapshot

As of March 29, 2026:

- The Stage 1 app is live on the production domain at `https://fintechlawyer.ca`.
- Render is serving the production site and the homepage/public-site redesign is live on that domain.
- Browser coverage now exists for:
  - authenticated happy path to final output
  - authenticated guidance-only / blocked drafting flow
  - guest-to-auth resume path for export
  - billing-success unlock return
- Render custom-domain bring-up and DNS cutover are no longer blockers.
- Remaining launch work is now mostly release hygiene and documentation:
  - record deployment notes per production release
  - keep production-domain acceptance checks current and written down
  - close remaining public-site metadata / copy inconsistencies
- The March 29, 2026 release `17e16e5` has a recorded deployment note and a live-domain acceptance run in [`DEPLOYMENT_NOTES.md`](/Users/matthewlevine/Repos/Finsurance/DEPLOYMENT_NOTES.md).

### Track 5: Payment Processing

Goal: keep payment and export unlock real without pretending the product is already a full entitlement platform.

Current state:
- the repo now has auth, session-backed workspace access, saved drafts, and file-backed persistence
- Stripe Checkout session creation, billing reconciliation, webhook handling, and billing-success return are implemented
- export unlock is currently draft-scoped rather than a broader subscription or seat-based entitlement layer

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

Required follow-up before broader commercialization:
- an explicit entitlement model beyond draft-scoped export unlock
- clearer admin visibility into paid sessions / failed sessions
- subscription or plan handling if pricing expands beyond the current model

Acceptance for Phase B:
- customer clicks pay from `https://fintechlawyer.ca`
- Stripe Checkout opens
- payment completes
- webhook confirms `checkout.session.completed`
- app can map payment to an account or entitlement record

## Next Product/App Steps

These are the next product-facing steps from the current repo state.

1. Decide how live-domain copy/download verification should work
Necessary work:
- choose whether production verification will use a paid smoke checkout, a pre-unlocked smoke-test draft, or a non-billable verification path
- make the release checklist explicit about that decision

2. Keep the deployment-note and production-acceptance record current for each new release
Necessary work:
- record commit SHA
- record domain tested
- record smoke result
- record known limitations

3. Pick the next small product-hardening or QA item
Options:
- add a tiny sample-scenario library for QA and demos
- add another small conflict / weak-signal rule pass if new patterns emerge
- add optional PDF export if document-grade output becomes the next most important need

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

- Deployment notes and acceptance records now exist, but they need to remain part of the release routine rather than one-off cleanup.
- Production acceptance still has one known limitation: copy/download actions were not fully exercised on the live domain because they require payment confirmation or an already-unlocked draft.
- If Stage 1 closure requires a full live-domain pass on those controls, the product still needs a safe verification path for unlocked export actions.
- Narrative export is still text-first. PDF output remains optional rather than required for Stage 1.

## Stage 1 Prioritized Roadmap

### Do Now

1. Establish a safe repeatable live-domain verification path for unlocked copy/download actions
Impact: high
Complexity: low
Why: this is the main remaining gap between the current production acceptance record and a fully unqualified Stage 1 sign-off.

2. Keep recording one deployment note and acceptance result per production release
Impact: medium
Complexity: low
Why: the release-note gap is now solved structurally, but it remains an ongoing launch discipline rather than a one-time task.

### Next

3. Add a tiny sample-scenario library for QA and demo scripts
Impact: medium
Complexity: low
Why: makes regression checking faster and more realistic.

4. Add lightweight internal visibility on top of the existing analytics hooks
Impact: low
Complexity: low
Why: event capture already exists, but there is not yet a polished internal reporting layer.

### Later

5. Optional PDF export
Impact: medium
Complexity: medium
Why: useful, but plain text and copy/download already cover MVP output.

6. Broader entitlement model beyond draft-scoped export unlock
Impact: medium
Complexity: medium
Why: useful if pricing expands beyond the current per-draft export model, but it is not required for the current Stage 1 MVP.

7. Optional server-side draft endpoint for shared deployment contracts
Impact: low to medium
Complexity: medium
Why: useful only if the hosting/runtime model changes or client-only logic becomes limiting.

### Not Worth It Right Now

8. Filing workflow, case queues, role-based approvals, or AML dashboard expansion
Impact: misaligned
Complexity: high
Why: pulls the product away from its disciplined scope.

## Stage 2 Roadmap

Everything in this section is explicitly out of scope for Stage 1 / the current MVP.

Note:
- some capabilities originally described here are now partially implemented in the current repo
- auth, saved drafts, billing hooks, and analytics capture already exist
- Stage 2 should now be read as the next fuller versions of those capabilities, not as net-new starts

1. Self-serve billing and entitlement checks
Why it matters:
- converts pilot access into a real commercial flow
- prevents manual post-payment fulfillment from becoming operational drag

2. Richer saved-session management and return-to-draft workflow
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

7. Organization-level roles and account management beyond the current single-owner model
Why it matters:
- supports teams rather than one-off users
- creates the foundation for billing, saved work, and controlled access

## Stage 3 Roadmap

Everything in this section is explicitly out of scope for Stage 1 / the current MVP.

These items are also intentionally beyond the nearer-term Stage 2 roadmap. They represent broader product expansion rather than immediate post-MVP hardening.

1. Support for additional FINTRAC report types beyond STRs
Why it matters:
- expands the product from a single-function STR drafting tool into broader FINTRAC reporting coverage
- allows the product to support additional reporting workflows without forcing users into separate tools

2. All-FINTRAC-reports product layer
Why it matters:
- creates a path from “STR drafting assistant” to a more complete FINTRAC reporting product
- makes future report templates, validation logic, and export behavior reusable across report types

3. Intake of client documents and raw source materials
Why it matters:
- allows the product to work from actual compliance artifacts rather than only structured form input
- reduces manual re-keying of facts that already exist in client files, records, or supporting documents

4. Intake of raw transactional and customer data
Why it matters:
- allows report drafting to start from transaction exports, customer records, and operational source data
- creates a path to structured fact extraction before narrative assembly

5. Draft-report generation from documents or raw data
Why it matters:
- moves the product from manual structured-entry drafting toward source-material-assisted drafting
- reduces operator effort when the relevant facts already exist in uploaded files or system exports

6. Source-to-draft extraction, normalization, and review workflow
Why it matters:
- gives operators a controlled way to review extracted facts before they become part of a report draft
- keeps the product explainable even when source documents or raw data are used as input
