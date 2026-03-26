import { expect, test } from "@playwright/test";

test("landing preset flow reaches final output", async ({ page }) => {
  await page.goto("/finsure");

  await expect(
    page.getByRole("heading", { name: "Audit-Ready, Always" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Start drafting" }).first().click();

  await expect(page.getByText("Section 1: Event Type")).toBeVisible();

  await page.getByRole("button", { name: /Cash Structuring/i }).click();

  await expect(page.getByText("Preset: Cash Structuring")).toBeVisible();

  await page.getByRole("button", { name: "Review Risk Signals" }).click();

  await expect(page.getByText("Risk Signal Review")).toBeVisible();

  await page.getByRole("button", { name: "Build Narrative Draft" }).click();

  await expect(page.getByText("Narrative Builder")).toBeVisible();

  await page.getByRole("button", { name: "Continue to Output" }).click();

  await expect(page.getByText("STR Draft Package")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Copy Full Package" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Download Full Package" }),
  ).toBeVisible();
  await expect(page.locator("textarea")).toContainText("[Subject Description]");
});
