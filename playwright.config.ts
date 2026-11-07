import { defineConfig, devices } from "@playwright/test";

const DEV_URL = "http://localhost:3000";
const PROD_URL = "http://localhost:4173";

// Screenshot baselines only match the browser and fonts they were made with,
// so visual tests run only inside the pinned Playwright container (CI, or
// locally with `npm run test:visual`), never against a laptop's browser.
const runVisual = process.env.VISUAL === "1";

export default defineConfig({
  testDir: "tests/e2e",
  // The flows share one seeded database, so run one test at a time
  workers: 1,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL: DEV_URL, trace: "retain-on-failure" },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] }, testIgnore: /visual|forcedDark/ },
    {
      name: "iphone",
      use: { ...devices["iPhone 15"] },
      testIgnore: /visual|forcedDark|metadata|links|header/,
    },
    {
      name: "pixel",
      use: { ...devices["Pixel 7"] },
      testIgnore: /visual|forcedDark|metadata|links|header/,
    },
    {
      // Chromium's forced dark mode, as some phone browsers apply to every site
      name: "forced-dark",
      testMatch: /forcedDark/,
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: { args: ["--enable-features=WebContentsForceDark"] },
      },
    },
    ...(runVisual
      ? [
          { name: "visual", testMatch: /visual/, use: { ...devices["Desktop Chrome"], baseURL: PROD_URL } },
          { name: "visual-phone", testMatch: /visual/, use: { ...devices["Pixel 7"], baseURL: PROD_URL } },
        ]
      : []),
  ],
  webServer: [
    {
      command: "npm run dev",
      url: DEV_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    ...(runVisual
      ? [
          {
            // The production build: Express serves the built app with the real CSP
            command: "npm run build && node server/server.js",
            url: `${PROD_URL}/health`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
            env: {
              NODE_ENV: "production",
              PORT: "4173",
              DATABASE_URL: `postgres://postgres:password@${process.env.DB_HOST || "localhost"}:5432/poststream_development`,
              JWT_SECRET: process.env.JWT_SECRET || "visual-tests-only",
            },
          },
        ]
      : []),
  ],
});
