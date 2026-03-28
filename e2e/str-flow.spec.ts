import { expect, test, type Page } from "@playwright/test";

async function registerWorkspace(page: Page, suffix: string) {
  const authForm = page.locator("#auth-access form");

  await page.getByRole("button", { name: "Create account to start" }).click();
  await authForm.getByLabel("Organization").fill(`Demo Team ${suffix}`);
  await authForm.getByLabel("Full name").fill("Demo Operator");
  await authForm.getByLabel("Email").fill(`demo-${suffix}@example.com`);
  await authForm.getByLabel("Password").fill("Password123");
  await authForm.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Your STR drafts" })).toBeVisible();
}

test("authenticated preset flow saves and reaches final output", async ({ page }) => {
  const suffix = Date.now().toString(36);

  await page.goto("/finsure");

  await expect(
    page.getByRole("heading", { name: "Generate an STR draft faster" }),
  ).toBeVisible();

  await registerWorkspace(page, suffix);

  await page.getByRole("button", { name: "New draft" }).click();

  await expect(page.getByText("Section 1: Event Type")).toBeVisible();

  await page.getByRole("button", { name: /Cash Structuring/i }).click();

  await expect(page.getByText("Preset: Cash Structuring")).toBeVisible();
  await page.getByLabel("Draft title").fill("Cash structuring review");
  await page.getByRole("button", { name: "Create draft" }).click();
  await page.getByRole("button", { name: "Saved drafts" }).click();

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

test("save success remains true when workspace refresh fails afterward", async ({ page }) => {
  const suffix = `${Date.now().toString(36)}-refresh`;
  let shouldFailNextWorkspaceRefresh = false;

  await page.goto("/finsure");
  await registerWorkspace(page, suffix);

  await page.route("**/api/workspace", async (route) => {
    if (shouldFailNextWorkspaceRefresh) {
      shouldFailNextWorkspaceRefresh = false;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          error: {
            code: "workspace_refresh_failed",
            message: "Simulated refresh failure",
          },
        }),
      });
      return;
    }

    await route.continue();
  });

  await page.getByRole("button", { name: "New draft" }).click();
  await page.getByRole("button", { name: /Cash Structuring/i }).click();
  await page.getByLabel("Draft title").fill("Refresh failure save");

  shouldFailNextWorkspaceRefresh = true;
  await page.getByRole("button", { name: "Create draft" }).click();

  await expect(
    page.getByText("Saved draft: Refresh failure save.", { exact: false }),
  ).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Your STR drafts" })).toBeVisible();
  await expect(page.getByText("Refresh failure save")).toBeVisible();
});
