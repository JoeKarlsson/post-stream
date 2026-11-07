import { test, expect } from "@playwright/test";
import { PAGES, watchForErrors } from "./helpers";

for (const { path, name } of PAGES) {
  test(`${name} page loads with no errors`, async ({ page }) => {
    const errors = watchForErrors(page);
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}

test("the nav reaches every top-level page", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "main" });

  await nav.getByRole("link", { name: "about" }).click();
  await expect(page.locator("h1")).toHaveText("what is PostStream?");

  await nav.getByRole("link", { name: "login" }).click();
  await expect(page.locator("h1")).toHaveText("sign in");

  await page.getByRole("link", { name: "PostStream" }).first().click();
  await expect(page.locator("h1")).toHaveText("PostStream");
});
