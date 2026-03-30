# Marketing Agents

This folder defines the canonical marketing agent system.

These are coordination and artifact-definition documents, not product workflow code.

## System Layers

- `discovery/`
  - problem-signal collection and normalization
- `acquisition/`
  - execution-support agents that create source artifacts
- `coordination/`
  - orchestration layer
- `optimization/`
  - validation and demand-capture analysis
- `strategy/`
  - strategy modeling layer

## Authority Model

- Founder = strategy authority
- LL = execution only
- Repo = current repository and system-definition layer

## Current Agents

1. ICP Builder Agent
   Layer: acquisition
2. Lead Sourcing Agent
   Layer: acquisition
3. Cold Outreach Agent
   Layer: acquisition
4. Lead Magnet Creator
   Layer: acquisition
5. Landing Page Agent
   Layer: acquisition
6. LL Marketing Orchestrator
   Layer: coordination
7. LL Growth Strategy Architect
   Layer: strategy
8. Problem Discovery Agent
   Layer: discovery
9. Content Strategy Engine
   Layer: strategy
10. Demand Capture Optimizer
   Layer: optimization

## Core Rule

Agent outputs must use the contracts in [marketing/contracts/artifact-schemas.md](/Users/matthewlevine/Repos/Finsurance/marketing/contracts/artifact-schemas.md).

## Skill Matrix

See [skills-matrix.md](/Users/matthewlevine/Repos/Finsurance/marketing/agents/skills-matrix.md).

## Learning Loop

This system now treats inbound learning as a first-class layer:

`PROBLEM_DISCOVERY -> CONTENT_STRATEGY -> LEAD_MAGNET / CONTENT -> LANDING_PAGE -> TOOL -> DEMAND_CAPTURE_OPTIMIZER -> GROWTH_STRATEGY_ARCHITECT -> Founder decisions`

## System Map

See [system-map.md](/Users/matthewlevine/Repos/Finsurance/marketing/agents/system-map.md).

## Immediate Priority

See [next-7-days-validation-plan.md](/Users/matthewlevine/Repos/Finsurance/marketing/agents/next-7-days-validation-plan.md).

## System Diagnosis

### Overbuilt

- lead sourcing
- outreach
- orchestration

### Underbuilt

- problem discovery
- demand capture and validation

Those underbuilt layers are the current bottleneck.
