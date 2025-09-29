import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true, // Run tests in parallel for speed
  forbidOnly: !!process.env.CI, // Prevent .only() in CI to avoid incomplete test runs
  retries: process.env.CI ? 2 : 0, // Retry flaky tests in CI environment
  workers: process.env.CI ? 1 : undefined, // Single worker in CI for stability
  reporter: "html", // Generate HTML reports
  use: {
    baseURL: "http://localhost:3000", // Default app URL for tests
    trace: "on-first-retry", // Capture traces for debugging failures
  },

  // Test across multiple browsers for comprehensive coverage
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  // Automatically start dev server for E2E tests
  webServer: {
    command: process.env.CI ? "npm run build && npm start" : "npm run dev", // Use dev server locally, production in CI
    port: 3000,
    reuseExistingServer: !process.env.CI, // Reuse server locally, fresh in CI
    env: {
      SKIP_ENV_VALIDATION: "true", // Skip env validation for testing
      DATABASE_URL: "postgresql://test:test@localhost:5432/testdb", // Test database
    },
  },
});
