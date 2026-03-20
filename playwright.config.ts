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
    command: "HOST=127.0.0.1 PORT=5000 npm run dev",
    url: "http://127.0.0.1:5000/api/health",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
