# Marketing Agent System Map

## Cross-Agent Interfaces

- `PROBLEM_DISCOVERY -> CONTENT_STRATEGY`
- `CONTENT_STRATEGY -> LEAD_MAGNET`
- `CONTENT_STRATEGY -> LANDING_PAGE`
- `LANDING_PAGE -> TOOL`
- `TOOL -> DEMAND_CAPTURE_OPTIMIZER`
- `DEMAND_CAPTURE_OPTIMIZER -> GROWTH_STRATEGY_ARCHITECT`
- `ICP_BUILDER -> LEAD_SOURCING`
- `ICP_BUILDER -> LEAD_MAGNET`
- `LEAD_SOURCING -> OUTREACH`
- `LEAD_MAGNET -> LANDING_PAGE`
- `ICP_BUILDER -> ALL`

`ICP_BUILDER` is the source-of-truth agent for segmentation definitions.

## Corrected Validation Flow

```text
PROBLEM_DISCOVERY
        ↓
CONTENT_STRATEGY
        ↓
LEAD_MAGNET / CONTENT
        ↓
LANDING_PAGE
        ↓
TOOL (validation)
        ↓
ON_SITE_CONVERSION
        ↓
DEMAND_CAPTURE_OPTIMIZER
        ↓
GROWTH_STRATEGY_ARCHITECT
        ↓
Founder decisions
```

## Commercial Path Split

### Primary Path

`ON_SITE_CAPTURE -> ON_SITE_CONVERSION -> PRODUCT_CHECKOUT`

### Secondary Path

`ON_SITE_CAPTURE -> ON_SITE_CONVERSION -> SERVICE_LEAD_CAPTURE`

## Core System Change

Before this layer, content strategy was topic-guessing.

After this layer, content strategy is driven by observed founder pain and demand signals.

## CEO-Level Constraint

For a micro SaaS, fast feedback loops are more important than scalable acquisition.

This system should optimize learning before scale.

## Strategy and Coordination Relationship

`GROWTH_STRATEGY_ARCHITECT`

- proposes strategy options

`Founder`

- decides

`ICP / Messaging / Offers`

- updated after Founder approval

`MARKETING_ORCHESTRATOR`

- assembles the approved system

`LL`

- executes

## Distinction

### Orchestrator

- role: coordination
- time horizon: campaign-level
- output: `CAMPAIGN_PLAN`
- authority: none
- Founder interaction: minimal

### Strategy Architect

- role: analysis and design
- time horizon: system-level
- output: `GROWTH_STRATEGY_PROPOSAL`
- authority: none
- Founder interaction: direct

## Operating Rule

Agents must plug into each other without ambiguity.

That means:

- explicit dependencies
- versioned artifacts
- schema-bound outputs
- clear escalation when inputs are missing or conflicting

## Tactical Example

Example problem signal:

`Do I need FINTRAC registration for a crypto app?`

Expected content chain:

- TOFU: `What is FINTRAC registration?`
- MOFU: `Do you need FINTRAC registration?`
- BOFU: `Generate your FINTRAC compliance checklist`

Expected validation loop:

- did the user click `generate`
- did the user complete the flow
- did the user reach pricing
- did the user attempt payment

## Execution Lane Split

- `on-site-capture`
  - creates the early intent signal
- `on-site-conversion`
  - owns pricing, monetization, and commercial routing after that signal
