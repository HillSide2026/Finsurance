import { expect, test } from "@playwright/test";

test("root homepage loads and exposes legal pages", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("img", { name: "FintechLawyer.ca" }).first()).toBeVisible();
  await expect(page.getByRole("img", { name: "FintechLawyer.ca" }).first()).toHaveAttribute(
    "src",
    /fintechlawyer-logo-rectangle\.png$/,
  );
  await expect(
    page.locator("header").first().getByRole("link", { name: "Industries", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator("header").first().getByRole("link", { name: "Services", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator("header").first().getByRole("link", { name: "Expertise", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator("header").first().getByRole("link", { name: "Contact" }),
  ).toHaveCount(0);
  await expect(page.locator("footer").getByRole("link", { name: "Contact" })).toBeVisible();
  await expect(page.locator("section#approach").getByText("Expertise", { exact: true })).toBeVisible();

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
    page.getByRole("heading", { name: "Generate an STR draft faster" }),
  ).toBeVisible();
});
