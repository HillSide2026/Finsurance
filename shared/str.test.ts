import assert from "node:assert/strict";
import test from "node:test";
import {
  buildStrDraft,
  createEmptyStrIntake,
  createIntakeFromPreset,
  strScenarioPresets,
} from "./str";

test("scenario presets provide complete starting points", () => {
  const preset = strScenarioPresets[0];

  assert.ok(preset, "expected at least one scenario preset");

  const intake = createIntakeFromPreset(preset.id);
  const draft = buildStrDraft(intake);

  assert.equal(draft.readiness.canGenerate, true);
  assert.equal(intake.scenarioPresetId, preset.id);
  assert.ok(intake.transactionChannels.length > 0);
  assert.ok(intake.customerData.referenceId.length > 0);
});

test("buildStrDraft identifies high-risk structuring scenarios with stronger narrative language", () => {
  const input = {
    ...createEmptyStrIntake(),
    triggerTypes: ["structuring", "third_party_involvement", "rapid_movement"],
    amountBand: "over_500k" as const,
    currency: "CAD" as const,
    transactionCount: "11_plus" as const,
    timeframe: "same_day" as const,
    transactionChannels: ["cash", "wire_transfer"] as const,
    clientRelationship: "new" as const,
    customerType: "business" as const,
    jurisdictions: ["canada", "high_risk_or_sanctioned"] as const,
    suspicionIndicators: [
      "source_of_funds_unclear",
      "avoidance_tactics",
      "inconsistent_behaviour",
    ] as const,
    customerData: {
      name: "Northgate Trading Ltd.",
      referenceId: "AML-2049",
      dateOfBirthOrIncorporation: "2024-08-14",
      occupationOrBusiness: "Wholesale electronics trading",
      expectedActivity: "Documented B2B invoice payments and domestic supplier settlements",
    },
    freeTextNotes:
      "Front-line staff documented evasive answers when asked to explain the cash source and destination of the outgoing transfers.",
  };

  const draft = buildStrDraft(input);

  assert.equal(draft.readiness.canGenerate, true);
  assert.equal(draft.suspicionLevel, "high");
  assert.ok(
    draft.redFlags.some((flag) => flag.id === "cash-structuring"),
    "expected the cash structuring rule to trigger",
  );
  assert.match(draft.narrativeText, /Northgate Trading Ltd\./);
  assert.match(
    draft.narrativeText,
    /money laundering or terrorist activity financing offence/i,
  );
  assert.match(
    draft.narrativeText,
    /did not align with the stated customer profile or expected activity/i,
  );
  assert.ok(
    draft.checklist.some((item) => item.includes("third party")),
    "expected the checklist to include third-party record retention",
  );
});

test("buildStrDraft reports conditional missing fields and customer-data prompts", () => {
  const input = {
    ...createEmptyStrIntake(),
    triggerTypes: ["other"] as const,
    currency: "other" as const,
    transactionChannels: ["other"] as const,
    suspicionIndicators: ["other", "source_of_funds_unclear"] as const,
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
    draft.missingFields.includes(
      'Specify the transaction channel when "other" is selected.',
    ),
  );
  assert.ok(
    draft.missingFields.includes('Add a short note for the "other" suspicion basis.'),
  );
  assert.ok(
    draft.missingInfoPrompts.includes(
      "Add the subject's full name or legal name if it is available.",
    ),
  );
  assert.ok(
    draft.missingInfoPrompts.includes(
      "Document what source-of-funds information was requested and why the explanation was not satisfactory.",
    ),
  );
});
