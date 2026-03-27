import { expect, test } from "@playwright/test";

test("root homepage loads and exposes legal pages", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Canadian FinTech Infrastructure and Tools",
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Privacy Policy" }).click();
  await expect(page).toHaveURL(/\/privacy-policy$/);
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();

  await page.goto("/");
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
