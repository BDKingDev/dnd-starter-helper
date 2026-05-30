import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: {
    command: "npm run dev -- --port 4173",
    env: {
      ...process.env,
      VITE_BASE_PATH: "/",
      VITE_SUBMISSION_ENDPOINT:
        process.env.VITE_SUBMISSION_ENDPOINT ??
        "https://script.google.com/macros/s/playwright-test/exec",
      VITE_SUBMISSION_TOKEN:
        process.env.VITE_SUBMISSION_TOKEN ?? "playwright-test-token"
    },
    url: "http://localhost:4173",
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "pipe",
    timeout: 120000
  }
});
