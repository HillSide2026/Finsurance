import { expect, test } from "@playwright/test";

test("root homepage loads and routes into FinSure", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Legal infrastructure for fintech teams building under real regulation.",
    }),
  ).toBeVisible();

  await page
    .locator("main section")
    .first()
    .getByRole("link", { name: "Explore FinSure" })
    .first()
    .click();

  await expect(page).toHaveURL(/\/finsure$/);
  await expect(
    page.getByRole("heading", { name: "Audit-Ready, Always" }),
  ).toBeVisible();
});
