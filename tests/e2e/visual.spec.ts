import { test, expect } from "@playwright/test";
import { watchForErrors } from "./helpers";

// Runs against the production build (real CSP) inside the pinned Playwright
// container. Element screenshots, so one change fails one test; nothing here
// depends on what's in the database.
test.beforeEach(async ({ page }) => {
  page.on("console", (msg) => {
    if (/Content Security Policy/i.test(msg.text())) throw new Error(`CSP violation: ${msg.text()}`);
  });
});

test("header and footer", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("header")).toHaveScreenshot("header.png");
  await expect(page.locator("footer")).toHaveScreenshot("footer.png");
});

test("about page", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("main")).toHaveScreenshot("about.png");
});

test("sign-in form, empty and with errors", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator("main")).toHaveScreenshot("login.png");
  await page.getByRole("button", { name: "sign in" }).click();
  await expect(page.locator("main")).toHaveScreenshot("login-errors.png");
});

test("404 page", async ({ page }) => {
  await page.goto("/no-such-page");
  await expect(page.locator("main")).toHaveScreenshot("404.png");
});

test("the production build runs under the CSP with no errors", async ({ page }) => {
  const errors = watchForErrors(page);
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("PostStream");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});
