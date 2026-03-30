# On-Site Conversion Routing Rules

This document defines the initial commercial routing model for `on-site-conversion`.

## Purpose

After a visitor shows initial interest or reaches a commercial decision point, this lane decides whether to route them toward:

- product checkout
- CAMLO as a Service lead capture
- Compliance as a Service lead capture
- Levine Law lead capture

## Routing Priority

The primary route is product checkout.

Service lead capture is the secondary fallback route.

## Product Checkout Route

Route toward product checkout when the visitor shows clear self-serve intent, such as:

- reaching pricing from the tool flow
- engaging with product-specific calls to action
- showing willingness to continue with structured self-serve output
- not signaling an immediate need for bespoke legal or managed-service support

## Service Lead Route

Route toward service capture when the visitor signals a better fit for human-led support, such as:

- asking for ongoing compliance support
- needing CAMLO as a Service
- needing Compliance as a Service
- needing direct legal support from Levine Law
- showing complexity or uncertainty that makes immediate self-serve purchase less likely

## Mixed-Intent Route

If the visitor shows both self-serve and service intent:

- present a structured choice
- preserve product pricing as the default visible option
- surface the relevant service lead path without hiding product monetization

## Metrics

Track:

- pricing view rate
- payment attempt rate
- checkout completion rate
- CAMLO lead capture rate
- Compliance as a Service lead capture rate
- Levine Law lead capture rate
- route-to-outcome accuracy

## Guardrails

- routing should be based on observable intent, not arbitrary preference
- routing logic should remain separate from product workflow logic
- routing changes should be measurable and reviewable
