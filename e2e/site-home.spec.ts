import { expect, test } from "@playwright/test";

test("root homepage loads and routes into FinSure", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Canadian Counsel for Global FinTech Teams",
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
