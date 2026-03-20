import assert from "node:assert/strict";
import test from "node:test";
import { buildStrDraft, createEmptyStrIntake } from "./str";

test("buildStrDraft identifies high-risk structuring scenarios", () => {
  const input = {
    ...createEmptyStrIntake(),
    triggerTypes: ["structuring", "third_party_involvement", "rapid_movement"],
    amountBand: "over_500k" as const,
    currency: "CAD" as const,
    transactionCount: "11_plus" as const,
    timeframe: "same_day" as const,
    clientRelationship: "new" as const,
    customerType: "business" as const,
    jurisdictions: ["canada", "high_risk_or_sanctioned"] as const,
    suspicionIndicators: [
      "source_of_funds_unclear",
      "avoidance_tactics",
      "inconsistent_behaviour",
    ] as const,
    freeTextNotes: "Front-line staff documented evasive answers when asked to explain the activity.",
  };

  const draft = buildStrDraft(input);

  assert.equal(draft.readiness.canGenerate, true);
  assert.equal(draft.suspicionLevel, "high");
  assert.ok(
    draft.redFlags.some((flag) => flag.id === "structuring-pattern"),
    "expected the structuring rule to trigger",
  );
  assert.match(
    draft.narrativeText,
    /reasonable grounds to suspect/i,
  );
  assert.match(
    draft.narrativeText,
    /Possible structuring to avoid reporting thresholds/,
  );
});

test("buildStrDraft reports conditional missing fields for other selections", () => {
  const input = {
    ...createEmptyStrIntake(),
    triggerTypes: ["other"] as const,
    currency: "other" as const,
    suspicionIndicators: ["other"] as const,
  };

  const draft = buildStrDraft(input);

  assert.equal(draft.readiness.canGenerate, false);
  assert.ok(
    draft.missingFields.includes('Add a short note for the "other" triggering concern.'),
  );
  assert.ok(
    draft.missingFields.includes('Specify the currency when "other" is selected.'),
  );
  assert.ok(
    draft.missingFields.includes('Add a short note for the "other" suspicion basis.'),
  );
});
