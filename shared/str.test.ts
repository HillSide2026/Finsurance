import assert from "node:assert/strict";
import test from "node:test";
import {
  buildStrDraft,
  createEmptyStrIntake,
  createIntakeFromPreset,
  normalizeStrIntake,
  strScenarioPresets,
} from "./str";

test("scenario presets provide representative starting points", () => {
  const highRiskPreset = strScenarioPresets.find((preset) => preset.id === "cash-structuring");
  const guidancePreset = strScenarioPresets.find(
    (preset) => preset.id === "low-information-walk-in",
  );

  assert.ok(highRiskPreset, "expected a high-risk preset");
  assert.ok(guidancePreset, "expected a guidance-only preset");

  const readyDraft = buildStrDraft(createIntakeFromPreset(highRiskPreset.id));
  const guidanceDraft = buildStrDraft(createIntakeFromPreset(guidancePreset.id));

  assert.equal(readyDraft.readiness.status, "ready_to_draft");
  assert.equal(readyDraft.readiness.canGenerate, true);
  assert.equal(guidanceDraft.readiness.status, "guidance_only");
  assert.equal(guidanceDraft.readiness.canGenerate, false);
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

test("buildStrDraft returns preliminary guidance when the intake is incomplete", () => {
  const input = {
    ...createEmptyStrIntake(),
    triggerTypes: ["unusual_transaction"] as const,
    amountBand: "10k_to_50k" as const,
    currency: "CAD" as const,
    transactionChannels: ["cash"] as const,
    suspicionIndicators: ["source_of_funds_unclear"] as const,
    freeTextNotes:
      "The customer could not satisfactorily explain the source of the funds at the counter.",
  };

  const draft = buildStrDraft(input);

  assert.equal(draft.readiness.status, "guidance_only");
  assert.equal(draft.readiness.canReviewRiskSignals, true);
  assert.equal(draft.readiness.canGenerate, false);
  assert.equal(draft.narrativeText, "");
  assert.equal(draft.narrativeSections.subjectDescription, "");
  assert.ok(
    draft.missingFields.includes("Choose the number of transactions."),
    "expected missing required transaction detail",
  );
  assert.ok(
    draft.redFlags.some((flag) => flag.id === "source-of-funds"),
    "expected preliminary red flags to still be available",
  );
});

test("empty intake stays blocked and does not produce a draft", () => {
  const draft = buildStrDraft(createEmptyStrIntake());

  assert.equal(draft.readiness.status, "insufficient_information");
  assert.equal(draft.readiness.canReviewRiskSignals, false);
  assert.equal(draft.readiness.canGenerate, false);
  assert.equal(draft.narrativeText, "");
  assert.ok(draft.missingFields.length > 0);
});

test("normalizeStrIntake trims whitespace, filters unknown values, and normalizes other fields", () => {
  const normalized = normalizeStrIntake({
    scenarioPresetId: "  demo-preset  ",
    triggerTypes: ["structuring", "structuring", "invalid"],
    triggerOtherText: "  should clear because other not selected  ",
    amountBand: "10k_to_50k",
    currency: "other",
    currencyOtherText: "  aed  ",
    transactionCount: "4_to_10",
    timeframe: "same_day",
    transactionChannels: ["cash", "cash", "other", "invalid"],
    transactionChannelOtherText: "  stored-value card loads ",
    clientRelationship: "new",
    customerType: "business",
    jurisdictions: ["canada", "canada", "multiple_jurisdictions", "bad"],
    suspicionIndicators: ["source_of_funds_unclear", "other", "bad"],
    suspicionOtherText: "  changed explanation when questioned ",
    customerData: {
      name: "  Example Corp.  ",
      referenceId: "  AML-12  ",
      occupationOrBusiness: "  Trading company ",
      expectedActivity: "  Domestic supplier payments  ",
    },
    freeTextNotes: "  first line \n\n second line  ",
  });

  assert.deepEqual(normalized.triggerTypes, ["structuring"]);
  assert.equal(normalized.triggerOtherText, "");
  assert.equal(normalized.currencyOtherText, "AED");
  assert.deepEqual(normalized.transactionChannels, ["cash", "other"]);
  assert.equal(normalized.transactionChannelOtherText, "stored-value card loads");
  assert.deepEqual(normalized.jurisdictions, ["canada", "multiple_jurisdictions"]);
  assert.deepEqual(normalized.suspicionIndicators, ["source_of_funds_unclear", "other"]);
  assert.equal(normalized.suspicionOtherText, "changed explanation when questioned");
  assert.equal(normalized.customerData.name, "Example Corp.");
  assert.equal(normalized.freeTextNotes, "first line second line");
});

test("conflicting presets surface input quality warnings and medium-risk presets stay out of high suspicion", () => {
  const conflictingDraft = buildStrDraft(createIntakeFromPreset("conflicting-structuring-intake"));
  const mediumDraft = buildStrDraft(createIntakeFromPreset("medium-risk-purpose-gap"));

  assert.equal(conflictingDraft.readiness.status, "ready_to_draft");
  assert.ok(
    conflictingDraft.qualityWarnings.some((warning) =>
      warning.includes("Structuring usually involves multiple transactions"),
    ),
    "expected conflicting structuring inputs to be flagged",
  );
  assert.ok(
    conflictingDraft.qualityWarnings.some((warning) =>
      warning.includes("Name the jurisdictions involved"),
    ),
    "expected generic multiple-jurisdiction selection to be flagged",
  );
  assert.equal(mediumDraft.suspicionLevel, "medium");
  assert.equal(mediumDraft.readiness.canGenerate, true);
});
