import { expect, test, type Page } from "@playwright/test";

async function registerWorkspace(page: Page, suffix: string) {
  await page.getByRole("button", { name: "Create account to draft" }).click();
  await page.getByLabel("Team name").fill(`Guidance Team ${suffix}`);
  await page.getByLabel("Full name").fill("Guidance Operator");
  await page.getByLabel("Workspace email").fill(`guidance-${suffix}@example.com`);
  await page.getByLabel("Password").fill("Password123");
  await page
    .locator("#auth-access form")
    .getByRole("button", { name: "Create account" })
    .click();
  await expect(page.getByRole("heading", { name: "Your active STR files" })).toBeVisible();
}

test("authenticated low-information flow stays in guidance-only mode", async ({ page }) => {
  const suffix = Date.now().toString(36);

  await page.goto("/finsure");

  await expect(
    page.getByRole("heading", { name: "Audit-Ready, Always" }),
  ).toBeVisible();

  await registerWorkspace(page, suffix);

  await page.getByRole("button", { name: "New draft" }).click();

  await expect(page.getByText("Section 1: Event Type")).toBeVisible();

  await page.getByRole("button", { name: /Low-Information Walk-In/i }).click();

  await expect(page.getByText("Preset: Low-Information Walk-In")).toBeVisible();
  await expect(page.getByText("Preliminary guidance only")).toBeVisible();

  await page.getByRole("button", { name: "Review Preliminary Risk Signals" }).click();

  await expect(page.getByText("Risk Signal Review")).toBeVisible();
  await expect(
    page.getByText(
      "There is enough information to surface preliminary risk signals, but key intake fields still need to be completed before drafting.",
    ),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Build Narrative Draft" }),
  ).toBeDisabled();
  await expect(
    page.getByText(
      "Review the signals now, then return to intake to complete the required gaps before drafting.",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Capture the stated purpose of the transaction(s) and why that explanation did not fit the observed activity.",
    ),
  ).toBeVisible();
});
