import { expect, test } from "@playwright/test";

test("landing low-information flow stays in guidance-only mode", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Audit-Ready, Always" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Start drafting" }).first().click();

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
