# Channel Test Template

Use this structure for each off-site source test.

## Required Fields

```yaml
artifact_type: CHANNEL_EXPERIMENT_PLAN
version: v1.0
timestamp: YYYY-MM-DDTHH:MM:SSZ
generator_agent: OFF_SITE_AGENT
source_artifacts:
  - ICP_PROFILE
  - LANDING_PAGE_SPEC
channel: string
hypothesis_id: string
objective: string
audience_hypothesis: string
destination: string
test_type: organic | paid | mixed
timebox_days: number
budget_cap:
  currency: CAD
  amount: number
success_thresholds:
  - metric: string
    operator: string
    target: string
kill_criteria:
  - condition: string
decision_rule:
  pass: string
  iterate: string
  kill: string
```

## Notes

- `destination` should point into the on-site funnel, not directly into product workflow logic.
- `success_thresholds` must include at least one commercial-signal threshold.
- `kill_criteria` should include both budget failure and quality failure.
