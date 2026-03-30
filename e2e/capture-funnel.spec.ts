import { expect, test } from "@playwright/test";

test("capture funnel pages load and generate a gated recommendation", async ({ page }) => {
  await page.goto("/compliance-checklist");

  await expect(page.getByRole("img", { name: "FintechLawyer.ca" }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Automate your FINTRAC and KYC compliance with confidence",
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Complete your Checklist" }).first().click();
  await expect(page.locator("#compliance-checklist-questionnaire")).toBeVisible();

  await page.getByRole("button", { name: "Crypto app" }).click();
  await page.getByRole("button", { name: "Launching" }).click();
  await page.getByRole("button", { name: "Yes, Canada is in scope" }).click();
  await page.getByRole("button", { name: "Self-serve checklist" }).click();
  await page.getByLabel("Email").fill("operator@example.com");
  await page.getByRole("button", { name: "Explore Results" }).click();

  await expect(page).toHaveURL(/\/compliance-checklist\/start$/);
  await expect(page.getByText("Your indicative compliance requirements", { exact: true })).toBeVisible();
  await expect(page.getByText("Early access pricing")).toBeVisible();
  await expect(page.getByText("$99", { exact: true })).toBeVisible();
  await expect(page.getByText("Selected route:")).toContainText("Existing product");
});
