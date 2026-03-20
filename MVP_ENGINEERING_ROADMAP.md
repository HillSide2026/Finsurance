# MVP Engineering Roadmap

This roadmap is based on the current codebase and the stabilization work already completed. It is written as an execution plan for taking the product from prototype quality to a credible MVP.

## Executive Summary

The app now has a stable baseline:

- client/server/shared structure is intact
- chat creation and navigation flows are repaired
- NDA retrieval is wired correctly
- backend NDA generation is no longer mocked
- sensitive API payload logging has been removed
- duplicate unused Replit chat scaffolding has been deleted
- the repo passes typecheck and production build

The next MVP push should focus on:

- replacing inference-heavy chat collection with structured intake
- moving from LLM-first drafting to a clause-based NDA engine
- making document generation province-aware for Canadian jurisdictions
- tightening privacy, access control, and operational safety
- adding a consistent legal disclaimer layer across the product

## Target MVP Architecture

The target architecture for NDA Esq is:

`Chat Interface -> Structured Intake -> Clause Engine -> NDA Assembly -> Preview + Export`

The product should not be architected as:

`Chat -> LLM -> NDA`

Detailed acceptance criteria for Phases 2-6 live in [MVP_ACCEPTANCE_CRITERIA.md](/Users/matthewlevine/NDA-Esq/MVP_ACCEPTANCE_CRITERIA.md).

## Current State

### Completed in Phase 1

- Fixed broken sidebar chat creation wiring in `client/src/components/Sidebar.tsx`
- Fixed `/chat/new` creation flow and failure handling in `client/src/pages/Chat.tsx`
- Fixed missing utility import and invalid-route handling in `client/src/pages/Chat.tsx`
- Reworked NDA fetch flow to load the latest NDA for a chat instead of using the wrong identifier
- Added `GET /api/chats/:id/nda` and latest-NDA storage lookup
- Replaced mock NDA generation with backend OpenAI draft generation using chat transcript + structured answers
- Removed API response-body logging from the server
- Removed unused duplicate chat implementation under `server/replit_integrations/chat/`
- Cleaned up typecheck blockers in batch/image/storage modules
- Verified `npm run check`
- Verified `npm run build`

### What the app can do now

- authenticate via Replit Auth
- create and load consultations
- persist user and assistant chat messages
- generate and store NDA drafts
- retrieve and preview the latest draft for a consultation

### What is still not MVP-complete

- consultation data is still mostly inferred from freeform chat
- NDA generation is still too LLM-heavy for a legal workflow
- there is no clause library or deterministic assembly layer
- there is no jurisdiction-aware clause selection for Canadian provinces
- disclaimers are present in some UI, but not as a deliberate product-wide legal safeguard
- there are no backend tests around ownership/privacy/document generation paths
- there is no explicit consultation completion state
- there is no billing or subscription model yet

## Proposed MVP Phases

## Non-Negotiable Product Constraints

These requirements should shape all remaining phases.

### Clause Library First

The MVP should not rely on a model drafting the entire NDA from scratch.

Preferred generation strategy:

- clause library
- structured assembly
- optional LLM refinement

This gives the product:

- predictable output
- more consistent legal language
- easier QA and legal review
- better auditability

### Jurisdiction Awareness

This product is for Canadian businesses. The intake and generation layers must support province-specific governing law behavior from the start.

At minimum, intake and clause selection must support:

- Ontario
- British Columbia
- Alberta
- Quebec if targeted later
- other provinces as roadmap extensions

### Disclaimer Layer

The product needs a consistent legal disclaimer layer before and after generation.

It should appear in:

- consultation UI
- NDA preview
- exported/downloaded documents where appropriate

Core message:

- this document is automatically generated
- it is not legal advice
- legal review is recommended before signing

## Phase 2: Structured Intake and Consultation State

### Goal

Move from a loose chat demo to a guided legal intake flow with explicit fields the system can trust.

### Why this phase matters

Right now the model can generate an NDA from transcript context, but that is not reliable enough for an MVP that users will treat as a legal workflow. We need known required fields, not just conversational inference.

### Scope

- Define the canonical NDA intake schema
- Add a consultation status model such as:
  - `intake_in_progress`
  - `ready_for_generation`
  - `draft_generated`
- Track explicit answers for required NDA fields
- Decide whether answers live in:
  - a dedicated `nda_intakes` table, or
  - structured JSON on `chats` or `ndas`
- Update backend prompts so the assistant gathers missing fields intentionally
- Add server-side validation for required generation fields
- Update the UI so users can see missing information before generation
- Add a progress or completeness indicator for the consultation
- Make backend readiness authoritative instead of having the frontend infer readiness from chat text

### Canonical MVP Intake Fields

- `disclosing_party_name`
- `receiving_party_name`
- `purpose`
- `governing_law_province`
- `confidentiality_term`
- `mutual_or_unilateral`
- `return_of_information`
- `confidential_information_categories`

Recommended optional fields:

- exclusions or carve-outs
- effective date
- signatory names and titles
- special instructions or business context

### Deliverables

- shared intake schema in `shared/`
- backend validation and persistence
- frontend display of collected fields / missing fields
- explicit readiness signal from backend instead of string matching in chat
- consultation status model and progress state

### Acceptance Criteria

- the system can tell exactly which required fields are still missing
- the frontend no longer relies on assistant message text to determine readiness
- NDA generation is blocked until minimum required fields are present
- the intake schema explicitly captures governing province and mutuality

## Phase 3: Clause-Based NDA Engine

### Goal

Make document generation reproducible, reviewable, and suitable for MVP-level trust.

### Why this phase matters

The current generation path is much better than a placeholder, but it is still too close to a single-step LLM draft. For legal output, the product needs structured assembly and controlled wording.

### Target Architecture

`Intake Data -> Clause Selector -> Clause Assembly -> Optional LLM Polishing -> Final NDA`

### Scope

- Introduce a structured generation payload from intake data
- Build a clause library for core NDA sections
- Add clause selection logic based on:
  - unilateral vs mutual
  - confidentiality term
  - governing province
  - return/destruction preferences
  - standard exclusions
- Move from transcript-first prompting to:
  - structured facts first
  - optional transcript context second
  - explicit document format requirements third
- Use LLMs only where they add value:
  - wording refinement
  - summary generation
  - optional clause explanation
- Add draft metadata such as:
  - generation version
  - prompt version
  - clause library version
  - created from intake snapshot
- Preserve generated drafts as immutable versions
- Improve placeholder handling for missing facts

### Example Clause Library Shape

- `confidentiality_standard`
- `confidentiality_mutual`
- `confidentiality_unilateral`
- `term_2_years`
- `term_5_years`
- `injunctive_relief`
- `governing_law_ontario`
- `governing_law_bc`
- `governing_law_alberta`
- `return_of_materials`
- `exclusions_standard`

### Required Document Sections

- Header
- Parties
- Purpose
- Definition of Confidential Information
- Obligations of the Receiving Party
- Exclusions
- Term
- Return or Destruction of Materials
- Governing Law
- Signature Blocks

### Deliverables

- clause library and selector
- deterministic document generation contract
- NDA versioning strategy
- generated document metadata
- improved preview output consistency

### Acceptance Criteria

- the same intake produces materially consistent output
- required sections always appear
- missing information appears as explicit placeholders instead of silent omissions
- a generated draft can be traced to the exact input set used to create it
- province-specific governing law clauses are selected correctly

## Phase 3A: Jurisdiction Awareness for Canada

### Goal

Ensure the product is explicitly aware of Canadian governing law choices rather than treating jurisdiction as a generic freeform field.

### Scope

- Define supported provinces for MVP
- Map each supported province to governing law and venue clauses
- Validate province selection at intake time
- Add clause rules for province-specific selection
- Make province selection visible in the preview and stored draft metadata

### Deliverables

- province enum / validation schema
- province-to-clause mapping
- supported-jurisdiction documentation

### Acceptance Criteria

- unsupported jurisdictions are rejected or explicitly marked unsupported
- province selection controls clause output deterministically
- Ontario, British Columbia, and Alberta work end to end for MVP

## Phase 4: Security, Privacy, and Operational Hardening

### Goal

Raise the app from functional to safe enough for early external users.

### Why this phase matters

The product handles legal and business-sensitive information. Privacy and access control are core product requirements, not follow-up polish.

### Scope

- Audit all route ownership checks for chats and NDAs
- Add centralized auth helpers instead of repeated request parsing
- Add environment validation for required secrets and database config
- Redact or minimize operational logging further where needed
- Add route-level tests for:
  - unauthorized access
  - cross-user access attempts
  - NDA retrieval ownership
- Review deployment assumptions around Replit Auth session behavior
- Decide whether MVP remains on Replit Auth or plans a migration path later

### Deliverables

- route ownership/security test coverage
- env validation on boot
- safer operational logging policy
- documented auth/platform decision

### Acceptance Criteria

- one user cannot retrieve another user's chat or NDA
- missing env configuration fails fast at startup
- logs no longer include sensitive user content

## Phase 5: Product Completion and UX Polish

### Goal

Turn the stabilized workflow into a coherent user-facing MVP.

### Scope

- Improve empty states and consultation onboarding
- Add visible consultation progress / readiness state
- Add guided question flow for required intake fields
- Add missing-fields review before generation
- Improve chat titles from real content
- Improve error and loading states across auth/chat/generation flows
- Improve NDA preview and download UX
- Add a formal disclaimer layer and review/escalation messaging
- Optionally add export improvements such as:
  - markdown download
  - text download
  - print-to-PDF polish

### Deliverables

- cleaner consultation lifecycle UX
- better document preview and review flow
- better recoverability from failed generation or fetch errors
- disclaimer coverage in UI, preview, and exported output

### Acceptance Criteria

- a first-time user can start, complete, generate, and review an NDA without confusion
- failure states provide a path forward
- generated drafts are easy to reopen and review later
- the user sees the legal disclaimer before relying on the generated document

## Phase 6: Billing and Access Control

### Goal

Add monetization only after the core document loop is trustworthy.

### Scope

- integrate Stripe subscriptions
- store subscription status in the database
- define feature gating:
  - free consultation, paid document generation
  - free draft, paid download/export
  - paid lawyer escalation
- add billing-aware middleware or route guards

### Deliverables

- Stripe integration
- subscription status persistence
- product gating rules

### Acceptance Criteria

- paid access is enforced server-side
- subscription state is reflected correctly in the UI

## Recommended Implementation Order

1. Structured intake schema and readiness state
2. Clause library and clause selection rules
3. Jurisdiction-aware generation for supported provinces
4. Security/privacy hardening and tests
5. UX polish across the consultation loop
6. Stripe and monetization

## Recommended Immediate Sprint

If the chief engineer wants the next highest-value sprint, it should be:

1. Add a structured intake schema and persistence model
2. Replace frontend readiness string matching with backend readiness state
3. Add province and mutuality fields to the intake model
4. Create the initial clause library and selector skeleton
5. Rework generation to consume structured intake data first, transcript second
6. Add route tests for chat/NDA ownership and unauthorized access
7. Add the formal disclaimer layer to UI and preview flows

## Risks and Decisions to Resolve Early

### 1. Auth platform decision

Current recommendation:

- keep Replit Auth for MVP

Question to confirm:

- is MVP staying on Replit-hosted infrastructure, or do we expect portability soon?

### 2. Document generation strategy

Question to confirm:

- do we want clause assembly with optional LLM refinement, or a more LLM-driven drafting strategy?

My recommendation:

- clause library + structured assembly + optional LLM refinement

### 3. Data model shape

Question to confirm:

- should intake data be stored as structured JSON for speed, or normalized tables for auditability?

My recommendation:

- structured JSON for MVP, with versioned snapshots attached to generated drafts

### 4. Supported jurisdictions at MVP launch

Question to confirm:

- which Canadian provinces are in scope for the first launch?

My recommendation:

- Ontario, British Columbia, and Alberta first

## Definition of MVP

The product should be considered MVP-ready when it can:

- authenticate a user reliably
- create and persist consultations reliably
- collect required NDA facts explicitly
- generate a consistent draft from structured intake plus clause-based assembly
- let the user reopen and review prior drafts
- apply province-aware governing law logic for supported jurisdictions
- protect user data with clear ownership checks
- show a clear legal disclaimer before the user relies on the document
- handle failures without losing the workflow

## Bottom Line

Phase 1 created a solid engineering baseline.

The next real milestone is not more UI or more integrations. It is turning the consultation into a structured intake system, introducing a clause-based Canadian NDA engine, and making the product safe and clear enough to be trusted as an MVP.
