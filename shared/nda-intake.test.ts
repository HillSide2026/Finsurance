import assert from "node:assert/strict";
import test from "node:test";
import {
  buildIntakeReadiness,
  createEmptyNdaIntake,
  deriveConsultationStatus,
  mergeNdaIntake,
} from "./nda-intake";

test("mergeNdaIntake preserves existing values and normalizes text", () => {
  const intake = mergeNdaIntake(createEmptyNdaIntake(), {
    disclosingPartyName: "  Levine Law  ",
    receivingPartyName: " Acme Ventures ",
    confidentialInformationCategories: [" pricing ", " roadmap "],
  });

  const updated = mergeNdaIntake(intake, {
    purpose: " Evaluate a partnership opportunity ",
  });

  assert.equal(updated.disclosingPartyName, "Levine Law");
  assert.equal(updated.receivingPartyName, "Acme Ventures");
  assert.equal(updated.purpose, "Evaluate a partnership opportunity");
  assert.deepEqual(updated.confidentialInformationCategories, [
    "pricing",
    "roadmap",
  ]);
});

test("buildIntakeReadiness reports missing required fields", () => {
  const readiness = buildIntakeReadiness(createEmptyNdaIntake());

  assert.equal(readiness.canGenerate, false);
  assert.equal(readiness.status, "intake_in_progress");
  assert.equal(readiness.completedFieldCount, 0);
  assert.ok(readiness.missingFieldLabels.includes("Disclosing party"));
  assert.ok(readiness.missingFieldLabels.includes("Governing law province"));
});

test("complete intake becomes ready for generation", () => {
  const intake = mergeNdaIntake(createEmptyNdaIntake(), {
    disclosingPartyName: "Levine Law",
    receivingPartyName: "Acme Ventures",
    purpose: "Discuss a vendor relationship",
    governingLawProvince: "ontario",
    confidentialityTerm: "2 years",
    mutuality: "unilateral",
    returnOfInformation: "return_or_destroy",
    confidentialInformationCategories: ["financial information", "source code"],
  });

  const readiness = buildIntakeReadiness(intake);

  assert.equal(readiness.canGenerate, true);
  assert.equal(readiness.status, "ready_for_generation");
  assert.equal(readiness.progressPercent, 100);
  assert.deepEqual(readiness.missingFields, []);
  assert.equal(deriveConsultationStatus(intake, true), "draft_generated");
});
