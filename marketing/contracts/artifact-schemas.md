# Artifact Schemas

All marketing-agent outputs must use these contract shapes.

## Global Required Fields

Every artifact must include:

- `artifact_type`
- `version`
- `timestamp`
- `generator_agent`
- `source_artifacts`

## CHANNEL_EXPERIMENT_PLAN

```yaml
artifact_type: CHANNEL_EXPERIMENT_PLAN
version: v1.0
timestamp: string
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
  currency: string
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

## CHANNEL_EXPERIMENT_REPORT

```yaml
artifact_type: CHANNEL_EXPERIMENT_REPORT
version: v1.0
timestamp: string
generator_agent: OFF_SITE_AGENT
source_artifacts:
  - CHANNEL_EXPERIMENT_PLAN
channel: string
hypothesis_id: string
actuals:
  spend: number
  sessions: number
  qualified_sessions: number
  primary_cta_rate: number
  pricing_reach_rate: number
  payment_attempts: number
  qualified_service_leads: number
outcome: pass | iterate | kill
rationale: string
next_action: string
```

## PROBLEM_SIGNAL_REPORT

```yaml
artifact_type: PROBLEM_SIGNAL_REPORT
version: v1.0
timestamp: string
generator_agent: PROBLEM_DISCOVERY
source_artifacts: []
signals:
  - signal_id: string
    source: string
    raw_text: string
    normalized_problem: string
    frequency_score: 1-100
    urgency_score: 1-10
    monetization_signal:
      - indicator: string
        strength: 1-10
clusters:
  - cluster_id: string
    problem_theme: string
    related_signals: [list]
    aggregate_score: number
emerging_keywords:
  - keyword: string
    intent_type: informational | commercial
    volume_proxy_score: number
```

## CONTENT_STRATEGY_MAP

```yaml
artifact_type: CONTENT_STRATEGY_MAP
version: v1.0
timestamp: string
generator_agent: CONTENT_STRATEGY_ENGINE
source_artifacts:
  - PROBLEM_SIGNAL_REPORT
  - ICP_PROFILE
topics:
  - topic_id: string
    keyword: string
    source_cluster_id: string
    funnel_stage: TOFU | MOFU | BOFU
    content_type: guide | comparison | tool-led
    target_ICP_segment: string
    conversion_path:
      - next_step: lead_magnet | tool | consult
prioritization:
  - topic_id: string
    priority_score: 1-100
    reasoning: string
content_gaps:
  - gap_description: string
    impacted_ICP: string
```

## ICP_PROFILE

```yaml
artifact_type: ICP_PROFILE
version: v1.0
timestamp: string
generator_agent: ICP_BUILDER
source_artifacts: []
segments:
  - segment_id: string
    name: string
    industry: [list]
    company_size:
      revenue_range: [min, max]
      employee_range: [min, max]
    buyer_personas:
      - title: string
        decision_power_score: 1-5
    pain_points:
      - problem: string
        legal_trigger_event: string
    value_alignment_score: 1-10
    disqualifiers:
      - condition: string
    priority_score: 1-100
```

## LEAD_LIST

```yaml
artifact_type: LEAD_LIST
version: v1.0
timestamp: string
generator_agent: LEAD_SOURCING
source_artifacts:
  - ICP_PROFILE
leads:
  - lead_id: string
    company_name: string
    website: string
    industry: string
    size: string
    location: string
    decision_makers:
      - name: string
        title: string
        linkedin_url: string
    ICP_match_score: 0-100
    source: string
    data_confidence_score: 0-1
```

## OUTREACH_SEQUENCE

```yaml
artifact_type: OUTREACH_SEQUENCE
version: v1.0
timestamp: string
generator_agent: COLD_OUTREACH
source_artifacts:
  - LEAD_LIST
  - ICP_PROFILE
lead_id: string
channels:
  - email:
      subject: string
      body: string
  - linkedin:
      connection_note: string
      follow_up: string
sequence_timing:
  - step: 1
    delay_days: 0
  - step: 2
    delay_days: 3
personalization_fields_used:
  - field_name: string
compliance_flags: []
```

## LEAD_MAGNET

```yaml
artifact_type: LEAD_MAGNET
version: v1.0
timestamp: string
generator_agent: LEAD_MAGNET_CREATOR
source_artifacts:
  - ICP_PROFILE
title: string
target_segment: string
pain_point_addressed: string
format: string
outline:
  - section: string
draft_content: string
call_to_action: string
value_score: 1-10
```

## LANDING_PAGE_SPEC

```yaml
artifact_type: LANDING_PAGE_SPEC
version: v1.0
timestamp: string
generator_agent: LANDING_PAGE
source_artifacts:
  - LEAD_MAGNET
  - ICP_PROFILE
sections:
  - hero:
      headline: string
      subheadline: string
      CTA: string
  - problem_section: string
  - solution_section: string
  - social_proof: string
  - offer_details: string
  - FAQ: string
conversion_elements:
  - form_fields: [list]
  - trust_signals: [list]
copy_variants:
  - variant_id: string
    headline: string
    CTA: string
```

## DEMAND_CAPTURE_REPORT

```yaml
artifact_type: DEMAND_CAPTURE_REPORT
version: v1.0
timestamp: string
generator_agent: DEMAND_CAPTURE_OPTIMIZER
source_artifacts:
  - LANDING_PAGE_SPEC
  - CONTENT_STRATEGY_MAP
funnel_metrics:
  - stage: string
    conversion_rate: number
drop_off_points:
  - stage: string
    severity_score: number
    hypothesis: string
user_intent_signals:
  - signal_type: click | form | pricing_view
    strength_score: number
recommendations:
  - change_id: string
    change_type: CTA | pricing | flow
    expected_impact: string
    confidence_score: number
validation_score:
  willingness_to_pay_score: 1-10
  problem_clarity_score: 1-10
```

## CAMPAIGN_PLAN

```yaml
artifact_type: CAMPAIGN_PLAN
version: v1.0
timestamp: string
generator_agent: LL_MARKETING_ORCHESTRATOR
source_artifacts:
  - ICP_PROFILE
  - LEAD_LIST
  - OUTREACH_SEQUENCE
  - LEAD_MAGNET
  - LANDING_PAGE_SPEC
campaign_id: string
objective: string
target_segments: [segment_id]
components:
  lead_source: string
  outreach: string
  offer: string
  landing_page: string
execution_plan:
  phases:
    - phase_id: string
      name: string
      duration_days: number
      actions:
        - action_id: string
          type: string
          dependency: string
          owner: LL
          input_artifact: string
channel_map:
  - channel: string
    associated_assets: [list]
tracking_plan:
  metrics:
    - metric_name: string
      source: string
      frequency: string
risk_flags: []
```

## GROWTH_STRATEGY_PROPOSAL

```yaml
artifact_type: GROWTH_STRATEGY_PROPOSAL
version: v1.0
timestamp: string
generator_agent: LL_GROWTH_STRATEGY_ARCHITECT
source_artifacts:
  - CAMPAIGN_PLAN
  - ICP_PROFILE
  - LEAD_MAGNET
  - OUTREACH_SEQUENCE
  - DEMAND_CAPTURE_REPORT
  - CONTENT_STRATEGY_MAP
  - PROBLEM_SIGNAL_REPORT
current_state:
  funnel_summary:
    - stage: string
      conversion_rate: number
  channel_performance:
    - channel: string
      CAC: number
      ROI: number
diagnosis:
  bottlenecks:
    - stage: string
      severity_score: 1-10
  root_causes:
    - hypothesis: string
      evidence_reference: string
strategy_options:
  - option_id: string
    name: string
    description: string
    changes:
      - ICP_adjustment: string
      - channel_shift: string
      - messaging_shift: string
      - offer_shift: string
    projected_impact:
      - metric: string
        expected_delta: string
    risks:
      - risk: string
        severity: string
        change_type: string
recommendation:
  preferred_option_id: string
  rationale: string
  tradeoffs: string
decision_required_from_Founder:
  - decision_area: string
    options: [list]
```

## Founder Decision Required Before Activation

Before activation, Founder must approve:

- ICP schema `v1.0`
- approved data sources
- messaging doctrine
- compliance constraints
