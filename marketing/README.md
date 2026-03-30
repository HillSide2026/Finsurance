# Marketing

This folder is the dedicated workspace for product marketing.

It is intentionally separate from product workflows, application code, and STR drafting logic.

## Structure

- `off-site/`
  - Traffic and awareness channels that happen away from the product site.
- `on-site-capture/`
  - Traffic capture and lead capture work on the site.
- `on-site-conversion/`
  - Conversion and purchase/activation work on the site.
- `shared/`
  - Shared context for all marketing agents.
- `agents/`
  - Canonical agent definitions and system relationships.
- `contracts/`
  - Schema-bound artifact definitions and interface contracts.

## Current Definition

- `off-site` source is not yet known.
- LinkedIn is the current off-site hypothesis, not a confirmed traffic source.
- `on-site-capture` is defined as the MVP validation funnel for willingness to pay.
- `on-site-conversion` is defined as the monetization and routing layer.
- `on-site-conversion` owns pricing exposure, payment attempts, monetization logic, and routing between product checkout and service lead capture.

## Current Marketing Objectives

Primary:

- validate product willingness to pay
- monetize the self-serve product

Secondary:

- capture leads for CAMLO as a Service
- capture leads for Compliance as a Service
- capture leads for Levine Law

## Lane Ownership

- `off-site`
  - traffic hypotheses, channel testing, awareness
- `on-site-capture`
  - early demand validation, initial product intent capture, willingness-to-pay discovery
- `on-site-conversion`
  - pricing exposure, payment attempts, monetization logic, and secondary service routing

## Agent Model

Marketing work can be assigned to separate marketing agents.

There are two parallel views of the system:

- execution lanes
- agent definitions

Execution lanes:

- off-site
- on-site capture
- on-site conversion

Canonical agent definitions live in [marketing/agents/README.md](/Users/matthewlevine/Repos/Finsurance/marketing/agents/README.md).

Each lane should work from its own brief and stay separate from product workflow logic.

## System Priority

For this product, fast feedback loops matter more than scalable acquisition.

That means the marketing system should prioritize:

- problem discovery
- content learning loops
- demand capture
- willingness-to-pay signals

before optimizing for outbound scale.

## Objective Stack

See [shared/objective-stack.md](/Users/matthewlevine/Repos/Finsurance/marketing/shared/objective-stack.md).
