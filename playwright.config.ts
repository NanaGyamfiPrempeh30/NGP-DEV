import { defineConfig } from "@playwright/test";

// Runs against a built site. Build with VERCEL_ENV=preview so unverified drafts are checked too.
export default defineConfig({
  testDir: "e2e",
  testMatch: "*.e2e.ts",
  outputDir: "test-results",
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
  },
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
