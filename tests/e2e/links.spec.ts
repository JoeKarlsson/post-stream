import { test, expect } from "@playwright/test";
import { PAGES } from "./helpers";

test("every link on every page goes somewhere real", async ({ page, request }) => {
  const internal = new Set<string>();
  const external = new Set<string>();

  for (const { path } of PAGES) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForLoadState("networkidle");
    for (const href of await page.locator("a[href]").evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href))) {
      const url = new URL(href);
      if (url.hash && url.pathname === new URL(page.url()).pathname) continue; // skip link
      (url.origin === new URL(page.url()).origin ? internal : external).add(url.href);
    }
  }

  // The app is a single-page app, so a broken internal link shows the 404 page
  for (const href of internal) {
    await page.goto(href);
    await expect(page.locator("h1"), href).not.toHaveText("404");
  }

  for (const href of external) {
    const response = await request.get(href, { maxRedirects: 5 });
    expect(response.status(), href).toBeLessThan(400);
  }
});
