# MVP Roadmap Review

This project already has a meaningful base. The next move is not to restart from a generic "create a React app + backend" checklist, but to stabilize what exists and then complete the missing MVP loops.

## Current State

- Frontend exists in `client/` with Vite, React, TypeScript, Tailwind, and React Query.
- Backend exists in `server/` with Express, Drizzle, Postgres, and OpenAI integration.
- Shared API contracts and DB schema live in `shared/`.
- Auth is wired through Replit Auth, not Supabase.
- Core domain tables already exist: `users`, `chats`, `messages`, `ndas`.
- The chat UI is polished enough for a demo.
- The NDA generation flow is still partly mocked and has broken wiring in a few places.

## Review of the Proposed Roadmap

### Step 1: Project structure

Status: Done

We do not have separate top-level `frontend/` and `backend/` folders, but we do have the same separation in a monorepo-style structure:

- `client/` = frontend
- `server/` = backend
- `shared/` = contracts/schema shared by both

This is acceptable and common in production apps. We should keep it.

### Step 2: Build the frontend

Status: Mostly done

Already present:

- Vite + React + TypeScript
- Tailwind
- Core pages and components
- Styling and layout system

Still needed:

- Fix broken chat page wiring
- Tighten empty/loading/error states
- Make the UI reflect real backend behavior instead of mocked assumptions

### Step 3: Add routing

Status: Partially done

Already present:

- `/`
- `/chat/:id`

Important note:

The current app uses `wouter`, not `react-router`. That is fine. There is no MVP value in swapping routers right now.

Recommended route set for this app:

- `/` landing page
- `/chat/new`
- `/chat/:id`
- optional `/account` or `/settings` later

Do not add placeholder pages just to match a generic checklist.

### Step 4: Add authentication

Status: Done enough for MVP, but platform decision required

Current state:

- Replit Auth is integrated
- Session handling exists
- Authenticated user endpoint exists

Roadmap mismatch:

The generic roadmap suggests Supabase auth. This project already uses Replit Auth. We should not run both.

Recommendation:

- If the product will stay Replit-hosted for MVP, keep Replit Auth.
- If the product needs platform portability soon, migrate fully to Supabase auth later as a deliberate project.

For now, keeping Replit Auth is the fastest path.

### Step 5: Create first database table

Status: Done, but ownership/security needs tightening

Already present:

- `users`
- `chats`
- `messages`
- `ndas`

What is missing:

- Consistent authorization checks across all data access paths
- Clear NDA retrieval flow
- A decision on whether to rely on server-side ownership checks only or add database-level policies later

Because this app handles sensitive legal content, privacy matters more than in a typical beginner SaaS.

### Step 6: Connect backend to OpenAI

Status: Partially done

Already present:

- Backend OpenAI client
- Chat message submission
- AI response persistence

Not done yet:

- Real NDA drafting pipeline
- Structured extraction of collected NDA fields
- Reliable "ready to generate" state
- Proper storage and retrieval of generated documents

Right now the backend still returns placeholder NDA content in the generation route, so this is not MVP-complete.

### Step 7: Handle beginner errors

Status: In progress by necessity

Current repo issues already show why this matters:

- Chat UI imports/wiring are inconsistent
- NDA preview fetch uses the wrong identifier
- There is dead or unused Replit template code in the repo
- Full local typecheck could not be run in this checkout because local dependencies are not installed

This step should become a real stabilization phase, not just a mindset note.

### Step 8: Add Stripe

Status: Not started

This should wait until the product can:

- authenticate users reliably
- create and store chats reliably
- generate a real NDA reliably
- protect user data reliably

Stripe is important, but not before the legal workflow is trustworthy.

### Step 9: Improve what matters

Status: This should guide the whole MVP

This advice fits the project well. The highest-value improvements now are:

- reliability
- privacy
- clear user flow
- accurate document generation

Not more pages or more integrations.

## What Actually Blocks MVP Today

1. NDA generation is still mocked in the backend.
2. The frontend NDA preview flow is wired incorrectly.
3. The app logs API JSON responses, which risks exposing sensitive legal/user data.
4. There are hook/component mismatches that likely break normal usage.
5. The repo contains unused Replit integration code, which adds confusion and maintenance risk.

## Recommended MVP Plan for This Repo

### Phase 1: Stabilize the current app

- Fix obvious frontend wiring bugs
- Fix broken NDA preview retrieval
- Remove or isolate unused template code
- Stop logging full API payloads
- Add basic env validation and clearer backend errors

Goal:

The existing chat app works consistently and safely enough to keep building on.

### Phase 2: Make the NDA workflow real

- Define the exact NDA fields we need to collect
- Track those fields explicitly instead of inferring from loose text only
- Generate real NDA content on the backend
- Save generated NDAs in a way the frontend can fetch correctly
- Show generation status and a trustworthy preview/download flow

Goal:

User completes a consultation and receives a real generated draft, not a placeholder.

### Phase 3: Harden auth and data ownership

- Audit every chat/NDA route for ownership checks
- Decide whether to stay with Replit Auth for MVP
- Clean up session/auth assumptions for local and deployed environments
- Add minimal audit-safe operational logging

Goal:

Sensitive user data is protected consistently.

### Phase 4: Polish the product loop

- Improve onboarding and empty states
- Add clearer prompts and legal disclaimers
- Improve loading/error states
- Make chat titles and document naming more useful

Goal:

The app feels intentional and usable, not just technically functional.

### Phase 5: Add monetization

- Add Stripe only after the core loop is stable
- Store subscription status
- Gate premium document generation or review features

Goal:

We monetize a working product, not an unstable demo.

## Suggested Immediate Next Sprint

If we want the fastest path from today's repo to MVP, the next sprint should be:

1. Fix frontend/runtime issues in chat and sidebar flows.
2. Replace mock NDA generation with a real backend output shape.
3. Connect generated NDA IDs to the preview flow correctly.
4. Remove sensitive API response logging.
5. Clean out unused Replit template modules that are no longer part of the product.

## Bottom Line

The roadmap is directionally good, but it is generic. Applied to this repo, the right move is:

- keep the current monorepo structure
- keep the current router
- keep Replit Auth for MVP unless we intentionally migrate
- stop thinking "start from scratch"
- finish and harden the existing NDA workflow

That is the shortest path to a credible MVP.
