import { test, expect } from "@playwright/test";
import { PAGES } from "./helpers";

// Local-only site: canonical URLs, Open Graph and sitemaps don't apply.
test("every page has a unique title, a description, dark-only metas and one h1", async ({ page }) => {
  const titles: string[] = [];

  for (const { path, name } of PAGES) {
    await page.goto(path);
    await expect(page.locator("h1"), name).toHaveCount(1);
    await expect(page).toHaveTitle(/PostStream/);
    titles.push(await page.title());

    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length, `${name} description`).toBeGreaterThan(20);
    expect(description!.length, `${name} description`).toBeLessThanOrEqual(160);
    await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute("content", "only dark");
    await expect(page.locator('meta[name="darkreader-lock"]')).toHaveCount(1);
    await expect(page.locator('meta[name="viewport"]')).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  }

  expect(new Set(titles).size, `titles: ${titles.join(" | ")}`).toBe(PAGES.length);
});

test("every icon and the manifest referenced in <head> exists", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')
    .evaluateAll((links) => links.map((l) => (l as HTMLLinkElement).href));
  expect(hrefs.length).toBeGreaterThanOrEqual(4);

  for (const href of hrefs) {
    const response = await page.request.get(href);
    expect(response.status(), href).toBe(200);
  }
});
