# Validation Funnel

This document defines the current on-site capture funnel for MVP validation.

## Objective

Validate:

`Will fintech founders pay for our self-serve compliance tool?`

This is a willingness-to-pay test, not just a general interest test.

The default commercial destination of this funnel is product pricing.

## Success Metric

Measure the percentage of visitors who do one of the following:

- click `Start tool`
- click `Get compliance checklist`
- enter an email address
- attempt to pay
- join a waitlist after seeing pricing

Priority of signals:

1. payment attempt or waitlist join after pricing
2. email capture
3. CTA click

## Sequencing Rule

Do not send large amounts of traffic until this funnel exists.

The validation infrastructure should be live before scaling any off-site traffic source.

## Funnel Structure

The funnel currently has two required pages.

## Page 1

Problem-aware landing page.

Example positioning:

`Automate your FINTRAC / KYC compliance`

This page should include:

- the specific outcome
- who it is for
- fintech founders
- crypto startups
- the pain
- confusion
- legal cost
- time burden

Primary CTA:

`Generate your compliance checklist`

## Page 2

Pseudo product / MVP validation layer.

This page is the key validation surface.

Flow:

1. user clicks CTA
2. user answers 3 to 5 questions
3. show `Your compliance requirements`
4. gate the output

Suggested questions:

- type of business
- crypto or payments
- stage: idea or launched

## Output Gate

After showing the tailored compliance requirement framing, gate the output using one of these options:

- email wall
- pricing page with `Coming soon` or `Early access`

The pricing page is the stronger validation signal.

Once the visitor reaches pricing, payment intent, or a commercial decision point, ownership passes to `on-site-conversion`.

Service lead capture should only appear as a secondary fallback path, not as the primary goal of this funnel.

## Interpretation

- Email wall = weak validation
- Pricing exposure plus willingness to continue = real validation
- Payment attempt = strongest product validation signal

## Boundary

This funnel belongs to marketing and validation.

It should remain segregated from product workflow logic, STR drafting logic, and the authenticated workspace flow.

## Measurement Layer

This funnel should feed the Demand Capture Optimizer.

The optimizer should watch:

- CTA clicks
- flow completion
- pricing views
- payment attempts
