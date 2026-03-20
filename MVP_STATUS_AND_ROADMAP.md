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
