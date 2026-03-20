# MVP Acceptance Criteria

This document defines the product-grade acceptance criteria for Phases 2-6 of NDA Esq. It is intended to align engineering, QA, and product on a single definition of done.

## Target MVP Architecture

The MVP architecture must be:

`Chat Interface -> Structured Intake -> Clause Engine -> NDA Assembly -> Preview + Export`

The product must not rely on:

`Chat -> LLM -> NDA`

Chat remains useful for guidance and intake assistance, but structured intake and deterministic assembly are the authoritative inputs to generation.

## Canonical Vocabulary

For product and QA, the canonical field names should be treated as snake_case. The current codebase already stores a working intake model in camelCase. During implementation, the API and storage layers may map between the two until a full normalization pass is completed.

| Canonical field | Current code field |
| --- | --- |
| `disclosing_party_name` | `disclosingPartyName` |
| `receiving_party_name` | `receivingPartyName` |
| `purpose_of_disclosure` | `purpose` |
| `governing_law_province` | `governingLawProvince` |
| `confidentiality_term` | `confidentialityTerm` |
| `mutual_or_unilateral` | `mutuality` |
| `return_or_destruction_required` | `returnOfInformation` |
| `confidential_information_categories` | `confidentialInformationCategories` |

Implementation note:

- `return_or_destruction_required` should be modeled with enough structure to support `return`, `destroy`, or `return_or_destroy`, not just a boolean.
- For MVP, `consultation` and `chat` can remain the same domain object as long as the consultation state model is authoritative.

## Current Repo Baseline

- Phase 2 is partially implemented in the current repo through the intake model in [shared/nda-intake.ts](/Users/matthewlevine/NDA-Esq/shared/nda-intake.ts), readiness logic, intake UI, and generation blocking.
- Phase 3 is not yet complete because generation is still LLM-heavy and there is no clause engine or immutable version model.
- Phase 4 is partially complete because route ownership checks, env validation, and log hardening exist, but centralized auth helpers, rate limiting, and security test coverage are incomplete.
- Phase 5 is partially complete because there is intake progress UI, preview UI, and basic export behavior, but guided workflow polish and consultation history are incomplete.
- Phase 6 is not started.

## Phase 2 - Structured Intake and Consultation State

### Goal

Replace freeform chat inference with explicit structured intake data required to generate an NDA.

### Feature: Canonical NDA Intake Schema

#### AC-2.1 Required Fields Exist

- Given a new consultation is created
- When the intake record is initialized
- Then the following fields must exist:
  - `disclosing_party_name`
  - `receiving_party_name`
  - `purpose_of_disclosure`
  - `governing_law_province`
  - `confidentiality_term`
  - `mutual_or_unilateral`
  - `return_or_destruction_required`
  - `confidential_information_categories`

#### AC-2.2 Intake Persistence

- Given a user provides an intake answer
- When the answer is submitted
- Then the value must be persisted in the database
- And it must be retrievable via API

#### AC-2.3 Intake Retrieval

- Given an existing consultation
- When the frontend requests the intake record
- Then the API must return the full intake object with:
  - all fields
  - missing fields
  - completion status
- And the canonical endpoint must be:
  - `GET /api/chats/:id/intake`

#### AC-2.4 Missing Field Detection

- Given an intake record exists
- When the system evaluates readiness
- Then the system must return a list of missing required fields
- And the response must indicate whether the consultation is ready for generation

Example:

```json
{
  "ready_for_generation": false,
  "missing_fields": [
    "receiving_party_name",
    "governing_law_province"
  ]
}
```

#### AC-2.5 Generation Blocking

- Given the user attempts NDA generation
- When required intake fields are missing
- Then generation must be blocked
- And the API must return the missing fields list

#### AC-2.6 Consultation Status

- Given consultations are persisted
- When status is stored
- Then the system must support:
  - `intake_in_progress`
  - `ready_for_generation`
  - `draft_generated`

#### AC-2.7 Status Transition Logic

- Given a consultation has a status
- When status transitions occur
- Then transitions must follow:
  - `intake_in_progress -> ready_for_generation`
  - `ready_for_generation -> draft_generated`
- And the system must never allow skipping states

#### AC-2.8 Intake Snapshotting

- Given an NDA is generated
- When generation occurs
- Then the system must save a snapshot of the intake data used

#### AC-2.9 Frontend Visibility

- Given a consultation page is open
- When intake data exists
- Then the UI must show:
  - completed fields
  - missing fields
  - readiness status

### Phase 2 Definition of Done

- all required intake fields are defined
- intake persistence exists in the database
- API endpoints exist for intake retrieval and updates
- readiness logic is implemented
- generation is blocked when intake is incomplete
- frontend shows intake state
- intake snapshot is saved on generation

## Phase 3 - Deterministic NDA Generation

### Goal

Make NDA output predictable, traceable, and reproducible.

### Feature: Structured Generation Pipeline

#### AC-3.1 Structured Generation Payload

- Given intake data exists
- When generation begins
- Then the system must create a structured payload containing:
  - `intake_snapshot`
  - `consultation_id`
  - `generation_version`
  - `prompt_version`

#### AC-3.2 Deterministic Section Structure

- Given an NDA is generated
- When document assembly completes
- Then every generated NDA must include:
  - Parties
  - Definition of Confidential Information
  - Obligations of Receiving Party
  - Exclusions
  - Term
  - Return or Destruction of Materials
  - Governing Law
  - Signatures
- And the system must reject outputs missing required sections

#### AC-3.3 Clause Template System

- Given the clause engine is implemented
- When documents are assembled
- Then the system must use stored clause templates rather than pure freeform drafting

Example clause families:

- `parties_clause`
- `definition_clause`
- `obligations_clause`
- `exclusions_clause`
- `term_clause`
- `return_of_materials_clause`
- `governing_law_ontario`

#### AC-3.4 Clause Selection Logic

- Given intake inputs exist
- When generation begins
- Then the correct clauses must be selected based on intake data

Example:

- if province is `Ontario`
- then use `governing_law_ontario`

#### AC-3.5 LLM Optional Refinement

- Given the clause engine assembles a draft
- When an LLM is used
- Then the LLM may:
  - rephrase clauses
  - fill placeholders
  - format the document
- And the LLM must not remove required sections

#### AC-3.6 Placeholder Handling

- Given optional data is missing
- When generation occurs
- Then placeholders must appear explicitly rather than silently omitting information

Example:

`[CONFIDENTIALITY TERM NOT SPECIFIED]`

#### AC-3.7 Immutable Draft Versions

- Given an NDA is generated
- When it is stored
- Then the system must persist an immutable version record containing:
  - `nda_id`
  - `consultation_id`
  - `intake_snapshot`
  - `generation_version`
  - `created_at`
  - `document_text`

#### AC-3.8 Output Reproducibility

- Given the same intake snapshot is used
- When generation runs twice with the same versions and clause set
- Then the output must be materially identical

### Phase 3 Definition of Done

- clause library is implemented
- deterministic generation pipeline exists
- immutable document storage exists
- section validation is enforced
- placeholder handling is implemented
- generation metadata is stored

## Phase 4 - Security, Privacy, and Operational Hardening

### Goal

Protect user data and ensure safe system operation.

### Feature: Ownership Enforcement

#### AC-4.1 Chat Ownership Validation

- Given a user requests a chat
- When the chat owner does not match the authenticated user
- Then the request must return `403 Forbidden`

#### AC-4.2 NDA Ownership Validation

- Given a user requests an NDA
- When the NDA belongs to another user
- Then the request must be rejected

#### AC-4.3 Cross-User Access Prevention

- Given security tests run
- When cross-user access scenarios are exercised
- Then automated tests must verify User A cannot access:
  - User B chats
  - User B NDAs

#### AC-4.4 Auth Middleware

- Given a protected route exists
- When it serves chat or NDA data
- Then it must use a centralized auth helper
- And this must include:
  - `/api/chats/*`
  - `/api/ndas/*`

#### AC-4.5 Environment Validation

- Given the server starts
- When required env variables are missing
- Then startup must fail
- And this must include:
  - `AI_INTEGRATIONS_OPENAI_API_KEY`
  - `DATABASE_URL`
  - `SESSION_SECRET`

#### AC-4.6 Logging Redaction

- Given logs are emitted
- When requests or failures occur
- Then logs must never include:
  - NDA document contents
  - chat transcripts
  - API keys
  - personal identifiers beyond what is operationally necessary

#### AC-4.7 Rate Limiting

- Given generation endpoints are exposed
- When a user exceeds the configured threshold
- Then requests must be throttled
- And the MVP baseline should support:
  - 10 NDA generations per hour per user

### Phase 4 Definition of Done

- ownership validation is enforced on all routes
- centralized auth middleware is implemented
- environment validation is enforced
- security tests are added
- logging redaction is enforced
- rate limiting protects generation routes

## Phase 5 - UX Completion and Workflow Polish

### Goal

Create a clear, low-friction NDA generation experience.

### Feature: Consultation Workflow

#### AC-5.1 First-Time User Flow

- Given a new user logs in
- When they create a consultation
- Then the system must guide them through the intake process

#### AC-5.2 Progress Indicator

- Given intake fields exist
- When the user views a consultation
- Then the UI must display intake progress

Example:

```text
NDA Setup Progress

✔ Parties
✔ Purpose
⚠ Governing Law
⚠ Confidentiality Term
```

#### AC-5.3 Missing Fields UI

- Given intake is incomplete
- When the user views the consultation
- Then the UI must highlight missing fields clearly

#### AC-5.4 Generate Button State

- Given the consultation is visible
- When intake is incomplete
- Then the Generate NDA button must be disabled
- And when intake is ready
- Then the Generate NDA button must be enabled

#### AC-5.5 NDA Preview Page

- Given an NDA has been generated
- When the preview opens
- Then the preview must display:
  - formatted document
  - section headings
  - generation date
  - version number

#### AC-5.6 Download Options

- Given an NDA preview is available
- When the user exports it
- Then the system must support:
  - download as text
  - download as markdown
  - print to PDF

#### AC-5.7 Failure Recovery

- Given generation fails
- When the user remains on the consultation
- Then the UI must show a retry path
- And intake data must not be lost

#### AC-5.8 Consultation History

- Given a user has prior consultations
- When they reopen one
- Then they must be able to view:
  - intake data
  - previous drafts
  - generation timestamps

### Phase 5 Definition of Done

- guided intake flow exists
- readiness UI is clear
- preview page is complete
- export options exist
- error recovery is implemented
- consultation history is visible

## Phase 6 - Billing and Access Control

### Goal

Enable monetization and subscription management.

### Feature: Stripe Integration

#### AC-6.1 Subscription Creation

- Given a user upgrades
- When checkout completes
- Then subscription status must be stored

#### AC-6.2 Subscription Status Storage

- Given a user account exists
- When billing state is persisted
- Then the record must store:
  - `subscription_status`
  - `plan_type`
  - `stripe_customer_id`

#### AC-6.3 Server-Side Access Control

- Given a user attempts generation or downloads
- When the server evaluates entitlements
- Then access must be checked server-side
- And the MVP baseline should support:
  - free users can preview only
  - paid users can download

#### AC-6.4 Stripe Webhook Handling

- Given Stripe emits billing events
- When the webhook is received
- Then the system must process:
  - `subscription_created`
  - `subscription_canceled`
  - `payment_failed`

#### AC-6.5 Billing UI

- Given a user is authenticated
- When they manage billing
- Then they must be able to:
  - view plan
  - upgrade plan
  - cancel subscription

#### AC-6.6 Access Revocation

- Given a subscription expires
- When the user attempts a restricted action
- Then access must be denied

### Phase 6 Definition of Done

- Stripe checkout is implemented
- webhook handling is implemented
- subscription persistence exists
- server-side feature gating is enforced
- billing UI exists

## Final Definition of MVP Completion

The system qualifies as MVP when users can:

1. Authenticate
2. Start a consultation
3. Complete structured intake
4. Generate a deterministic NDA
5. Preview and download the document
6. Reopen past consultations
7. Trust that their data is protected

And the system:

- prevents unauthorized data access
- produces consistent documents
- handles errors safely
- supports paid access
