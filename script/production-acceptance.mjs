import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.ACCEPTANCE_BASE_URL ?? "https://fintechlawyer.ca";
const outputPath =
  process.env.ACCEPTANCE_OUTPUT_PATH ?? "/tmp/stage1-production-acceptance.json";

const result = {
  checkedAt: new Date().toISOString(),
  domain: base,
  checks: {},
  smokeResult: "pending",
  knownLimitations: [],
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1024 } });

try {
  const healthRes = await fetch(`${base}/api/health`);
  const healthJson = await healthRes.json();
  assert.equal(healthRes.status, 200);
  assert.equal(healthJson.ok, true);
  result.checks.apiHealth = { status: "pass" };

  const notFoundRes = await fetch(`${base}/api/not-found`);
  const notFoundJson = await notFoundRes.json();
  assert.equal(notFoundRes.status, 404);
  assert.equal(notFoundJson.ok, false);
  assert.equal(typeof notFoundJson.error?.code, "string");
  result.checks.apiJson404 = { status: "pass", code: notFoundJson.error.code };

  const blankPage = await context.newPage();
  await blankPage.goto(`${base}/finsure`, { waitUntil: "networkidle" });
  await blankPage.getByRole("button", { name: "Start drafting now" }).click();
  await blankPage.getByText("Section 1: Event Type").waitFor();
  assert.equal(
    await blankPage.getByRole("button", { name: "Add More Intake Detail" }).isDisabled(),
    true,
  );
  await blankPage.getByText("Select at least one triggering concern.").waitFor();
  await blankPage.getByText("Choose the number of transactions.").waitFor();
  result.checks.blankIntakeBlocked = { status: "pass" };
  await blankPage.close();

  const guidancePage = await context.newPage();
  await guidancePage.goto(`${base}/finsure`, { waitUntil: "networkidle" });
  await guidancePage.getByRole("button", { name: "Start drafting now" }).click();
  await guidancePage.getByRole("button", { name: /Low-Information Walk-In/i }).click();
  await guidancePage.getByText("Preset: Low-Information Walk-In").waitFor();
  await guidancePage.getByText("Preliminary guidance only").waitFor();
  await guidancePage
    .getByRole("button", { name: "Review Preliminary Risk Signals" })
    .click();
  await guidancePage.getByText("Risk Signal Review").waitFor();
  await guidancePage
    .getByText(
      "There is enough information to surface preliminary risk signals, but key intake fields still need to be completed before drafting.",
    )
    .waitFor();
  assert.equal(
    await guidancePage.getByRole("button", { name: "Build Narrative Draft" }).isDisabled(),
    true,
  );
  result.checks.guidanceOnlyFlow = { status: "pass" };
  await guidancePage.close();

  const draftPage = await context.newPage();
  await draftPage.goto(`${base}/finsure`, { waitUntil: "networkidle" });
  await draftPage.getByRole("button", { name: "Start drafting now" }).click();
  await draftPage.getByRole("button", { name: /Cash Structuring/i }).click();
  await draftPage.getByText("Preset: Cash Structuring").waitFor();
  await draftPage.getByRole("button", { name: "Review Risk Signals" }).click();
  await draftPage.getByText("Risk Signal Review").waitFor();
  await draftPage.getByRole("button", { name: "Build Narrative Draft" }).click();
  await draftPage.getByText("Narrative Builder").waitFor();
  await draftPage.getByRole("button", { name: "Continue to Output" }).click();
  await draftPage.getByText("STR Draft Package").waitFor();
  await draftPage.getByRole("button", { name: "Export STR - $9" }).waitFor();
  const draftValue = await draftPage.locator("textarea").inputValue();
  assert.match(draftValue, /\[Subject Description\]/);
  result.checks.highRiskPresetToFinalDraft = { status: "pass" };
  result.checks.copyDownloadActions = {
    status: "limited",
    detail:
      "Preview and export CTA verified on production, but copy/download controls remain locked behind a paid or pre-unlocked draft.",
  };
  result.knownLimitations.push(
    "Copy/download actions were not fully exercised on production because the current UI only exposes them after payment confirmation or an already-unlocked draft.",
  );
  await draftPage.close();

  result.smokeResult =
    result.knownLimitations.length > 0 ? "pass_with_known_limitations" : "pass";
} catch (error) {
  result.smokeResult = "failed";
  result.failure =
    error instanceof Error
      ? { message: error.message, stack: error.stack }
      : { message: String(error) };
  throw error;
} finally {
  await browser.close();
  await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
}
