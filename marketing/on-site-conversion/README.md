# On-Site Conversion

This folder is for on-site conversion work.

This lane owns the monetization layer after initial capture or tool engagement.

## Ownership

This lane owns:

- pricing exposure
- payment attempts
- monetization logic
- routing rules between product checkout and service lead capture
- trust and objection handling at the point of conversion

## Primary Objectives

- monetize the product
- convert qualified self-serve users into payment attempts
- route high-intent visitors into product checkout by default

## Secondary Objectives

- capture qualified service leads when product purchase is not the best immediate path

## Conversion Paths

### Product Path

- default path
- pricing view
- payment attempt
- checkout completion

### Service Path

- secondary fallback path
- CAMLO as a Service lead capture
- Compliance as a Service lead capture
- Levine Law lead capture

## Key Metrics

- percentage of users reaching pricing
- percentage of users attempting to pay
- checkout completion rate
- service lead capture rate
- route-to-outcome accuracy

## Boundary With Capture

`on-site-capture` owns early demand validation and initial signal collection.

`on-site-conversion` owns the commercial decision point after that signal is created.

The default commercial path is product checkout.

Service lead capture exists as a secondary fallback path.

## Working Spec

See [routing-rules.md](/Users/matthewlevine/Repos/Finsurance/marketing/on-site-conversion/routing-rules.md) for the initial routing model.
