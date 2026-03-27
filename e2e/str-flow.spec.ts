import { expect, test, type Page } from "@playwright/test";

async function registerWorkspace(page: Page, suffix: string) {
  await page.getByRole("button", { name: "Create account to draft" }).click();
  await page.getByLabel("Team name").fill(`Demo Team ${suffix}`);
  await page.getByLabel("Full name").fill("Demo Operator");
  await page.getByLabel("Workspace email").fill(`demo-${suffix}@example.com`);
  await page.getByLabel("Password").fill("Password123");
  await page
    .locator("#auth-access form")
    .getByRole("button", { name: "Create account" })
    .click();
  await expect(page.getByRole("heading", { name: "Your active STR files" })).toBeVisible();
}

test("authenticated preset flow saves and reaches final output", async ({ page }) => {
  const suffix = Date.now().toString(36);

  await page.goto("/finsure");

  await expect(
    page.getByRole("heading", { name: "Audit-Ready, Always" }),
  ).toBeVisible();

  await registerWorkspace(page, suffix);

  await page.getByRole("button", { name: "New draft" }).click();

  await expect(page.getByText("Section 1: Event Type")).toBeVisible();

  await page.getByRole("button", { name: /Cash Structuring/i }).click();

  await expect(page.getByText("Preset: Cash Structuring")).toBeVisible();
  await page.getByLabel("Draft title").fill("Cash structuring review");
  await page.getByRole("button", { name: "Create draft" }).click();
  await page.getByRole("button", { name: "Workspace" }).click();

  await expect(page.getByText("Cash structuring review")).toBeVisible();
  await page.getByRole("button", { name: "Open" }).first().click();
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
