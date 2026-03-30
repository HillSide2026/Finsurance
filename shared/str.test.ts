import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDraftPackageText,
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

test("buildDraftPackageText assembles a self-contained STR package export", () => {
  const draft = buildStrDraft(createIntakeFromPreset("cash-structuring"));
  const editedNarrative = `${draft.narrativeText}\n\n[Operator Note]\nReviewed internally before escalation.`;

  const packageText = buildDraftPackageText(draft, {
    productName: "FinSure",
    sessionId: "STR-TEST-1",
    sessionTimestamp: "2026-03-20T15:30:00.000Z",
    narrativeText: editedNarrative,
  });

  assert.match(packageText, /^FinSure STR Draft Package/m);
  assert.match(packageText, /Session: STR-TEST-1/);
  assert.match(packageText, /Session started: 2026-03-20T15:30:00.000Z/);
  assert.match(packageText, /\[Facts Provided\]/);
  assert.match(packageText, /\[Detected Red Flags\]/);
  assert.match(packageText, /\[Draft Narrative\]/);
  assert.match(packageText, /\[Compliance Checklist\]/);
  assert.match(packageText, /\[Operator Note\]/);
});

test("rapid new-client cash-to-electronic scenarios trigger stronger rules and guidance", () => {
  const draft = buildStrDraft({
    ...createEmptyStrIntake(),
    triggerTypes: ["rapid_movement"],
    amountBand: "100k_to_500k",
    currency: "CAD",
    transactionCount: "4_to_10",
    timeframe: "same_day",
    transactionChannels: ["cash", "wire_transfer"],
    clientRelationship: "new",
    customerType: "business",
    jurisdictions: ["canada", "united_states"],
    suspicionIndicators: ["inconsistent_behaviour"],
    customerData: {
      name: "Signal Ridge Advisory Inc.",
      referenceId: "FAST-3001",
      dateOfBirthOrIncorporation: "2025-06-04",
      occupationOrBusiness: "Business advisory firm",
      expectedActivity: "",
    },
    freeTextNotes:
      "Staff observed incoming cash activity followed by outgoing transfers without a credible explanation.",
  });

  assert.ok(
    draft.redFlags.some((flag) => flag.id === "new-client-pass-through"),
    "expected the new-client pass-through rule to trigger",
  );
  assert.ok(
    draft.redFlags.some((flag) => flag.id === "cash-to-electronic-conversion"),
    "expected the cash-to-electronic conversion rule to trigger",
  );
  assert.ok(
    draft.redFlags.some((flag) => flag.id === "high-value-profile-mismatch"),
    "expected the high-value profile mismatch rule to trigger",
  );
  assert.ok(
    draft.qualityWarnings.some((warning) =>
      warning.includes("expected activity established at onboarding"),
    ),
    "expected onboarding guidance when early high-value activity lacks expected activity detail",
  );
  assert.ok(
    draft.qualityWarnings.some((warning) =>
      warning.includes("origin and destination account"),
    ),
    "expected a warning for missing origin and destination detail",
  );
  assert.ok(
    draft.missingInfoPrompts.some((prompt) =>
      prompt.includes("cash activity was followed by outgoing electronic movement"),
    ),
    "expected a prompt tying cash activity to electronic follow-on movement",
  );
});

test("unusual activity scenarios ask for the stated transaction purpose when notes stay generic", () => {
  const draft = buildStrDraft({
    ...createEmptyStrIntake(),
    triggerTypes: ["unusual_transaction"],
    amountBand: "10k_to_50k",
    currency: "CAD",
    transactionCount: "2_to_3",
    timeframe: "2_to_7_days",
    transactionChannels: ["cheque"],
    clientRelationship: "existing",
    customerType: "individual",
    jurisdictions: ["canada"],
    suspicionIndicators: ["inconsistent_behaviour"],
    customerData: {
      name: "Taylor Example",
      referenceId: "PUR-4402",
      dateOfBirthOrIncorporation: "",
      occupationOrBusiness: "Salaried employee",
      expectedActivity: "Routine payroll deposits and household spending",
    },
    freeTextNotes: "Staff observed cheque activity that did not match prior account use.",
  });

  assert.ok(
    draft.qualityWarnings.some((warning) =>
      warning.includes("stated purpose or commercial rationale"),
    ),
    "expected a warning when the transaction purpose is not captured in the notes",
  );
});

test("third-party cross-border scenarios trigger stronger transparency signals and generic-input warnings", () => {
  const draft = buildStrDraft({
    ...createEmptyStrIntake(),
    triggerTypes: ["third_party_involvement", "rapid_movement"],
    amountBand: "50k_to_100k",
    currency: "CAD",
    transactionCount: "2_to_3",
    timeframe: "2_to_7_days",
    transactionChannels: ["wire_transfer"],
    clientRelationship: "existing",
    customerType: "individual",
    jurisdictions: ["high_risk_or_sanctioned"],
    suspicionIndicators: ["source_of_funds_unclear"],
    customerData: {
      name: "Jordan Example",
      referenceId: "TP-7701",
      dateOfBirthOrIncorporation: "",
      occupationOrBusiness: "Independent consultant",
      expectedActivity: "Domestic consulting invoices and ordinary operating expenses",
    },
    freeTextNotes:
      "Staff observed outgoing wire activity and could not obtain a satisfactory explanation for the source of funds.",
  });

  assert.equal(draft.readiness.status, "ready_to_draft");
  assert.ok(
    draft.redFlags.some((flag) => flag.id === "third-party-cross-border-layering"),
    "expected the combined third-party cross-border rule to trigger",
  );
  assert.ok(
    draft.qualityWarnings.some((warning) =>
      warning.includes("specific high-risk or sanctioned jurisdiction"),
    ),
    "expected a warning for generic high-risk jurisdiction selection",
  );
  assert.ok(
    draft.qualityWarnings.some((warning) =>
      warning.includes("Name the third party or describe the stated relationship"),
    ),
    "expected a warning when the third party is not actually described in the notes",
  );
});
