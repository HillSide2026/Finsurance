import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:5000",
    headless: true,
    trace: "on-first-retry",
    viewport: { width: 1440, height: 1024 },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command:
      "APP_DATA_PATH=/tmp/finsurance-playwright-app-store.json HOST=127.0.0.1 PORT=5000 npm run dev",
    url: "http://127.0.0.1:5000/api/health",
    // Always start the isolated Playwright server so browser tests never reuse
    // a developer server that points at the live local app store.
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
