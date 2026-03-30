# Marketing Agent Operating Rules

These rules apply to all marketing agents working in this folder.

## Boundary

Marketing work must remain segregated from:

- product workflow logic
- STR drafting logic
- authenticated workspace flows
- server-side product behavior

## Authority

Founder is the strategy authority.

Founder approval is required for:

- ICP definitions
- messaging frameworks
- offers

LL is execution only.

## Ownership Model

Each agent should work inside its own lane:

- off-site
- on-site capture
- on-site conversion

## Deliverable Preference

Agents should produce marketing artifacts such as:

- messaging docs
- campaign briefs
- landing page hypotheses
- funnel drafts
- test plans
- experiment logs

They should not directly redefine core product workflow behavior unless that work is explicitly handed back to the product side.

## Determinism

All agent outputs must be schema-bound.

Freeform-only outputs are not sufficient.

Use the artifact contracts in [marketing/contracts/artifact-schemas.md](/Users/matthewlevine/Repos/Finsurance/marketing/contracts/artifact-schemas.md).

## Traceability

Each artifact must include:

- `source_artifacts`
- `version`
- `timestamp`
- `generator_agent`

## Validation Standard

Prefer measurable signals over vanity signals.

Examples:

- CTA click-through
- email capture rate
- pricing-page continuation
- waitlist join after pricing exposure

## Channel Experiment Rule

Off-site channels must be run as experiments before they are treated as strategic sources.

Every off-site test must define:

- budget cap
- timebox
- success thresholds
- kill criteria

No channel should scale until it passes those conditions.

## Learning Priority

For this product, fast feedback loops take priority over scalable acquisition.

Marketing should prefer:

- validated demand signals
- observed founder pain
- willingness-to-pay evidence

over topic guessing or premature scale.

## Coordination

Shared inputs should live in `marketing/shared/`.

Lane-specific execution should live in the lane folder.

System-level coordination should live in `marketing/agents/` and `marketing/contracts/`.

## Known Gaps

Current backlog gaps:

- no closed-loop refinement from outreach performance back into ICP updates
- no full attribution model
- no A/B testing agent

## Founder Decision Required Before Activation

Before activation, Founder must approve:

- ICP schema `v1.0`
- approved data sources
- messaging doctrine
- compliance constraints
