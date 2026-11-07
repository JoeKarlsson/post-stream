import { test, expect, Page } from "@playwright/test";
import { PAGES, SEED_USERS, loginAs } from "./helpers";

const expectNoSidewaysScroll = async (page: Page, label: string) => {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth, label).toBeLessThanOrEqual(innerWidth);
};

// WCAG 2.2 target size: standalone controls at least 24px. Links inside a
// sentence are exempt, so only check buttons and links that stand alone.
const smallTargets = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("button, a")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        const inSentence = el.tagName === "A" && el.closest("p") && !el.closest("[class*=wrapper]");
        return r.width > 0 && r.height < 24 && !inSentence;
      })
      .map((el) => el.textContent?.trim())
  );

for (const width of [390, 320]) {
  test(`no sideways scroll and big enough tap targets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await loginAs(page, SEED_USERS.jane.email);

    for (const { path, name } of [...PAGES, { path: `/user/${SEED_USERS.jane.username}/edit`, name: "edit profile" }]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      await page.waitForLoadState("networkidle");
      await expectNoSidewaysScroll(page, `${name} at ${width}px`);
      expect(await smallTargets(page), `${name} at ${width}px`).toEqual([]);
    }
  });
}

test("form fields are at least 16px so iOS doesn't zoom on focus", async ({ page }) => {
  await loginAs(page, SEED_USERS.jane.email);
  await page.goto("/");
  const sizes = await page.locator("input, textarea").evaluateAll((els) =>
    els.map((el) => parseFloat(getComputedStyle(el).fontSize))
  );
  expect(sizes.length).toBeGreaterThan(0);
  for (const size of sizes) expect(size).toBeGreaterThanOrEqual(16);
});
