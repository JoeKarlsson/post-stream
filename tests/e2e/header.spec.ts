import { test, expect } from "@playwright/test";
import { PAGES } from "./helpers";

// Every page shares one header: same nav position, same h1 size and offset
test("the page header lines up the same on every page", async ({ page }) => {
  const measurements: Record<string, { h1Top: number; h1Size: string; h1Left: number; navTop: number }> = {};

  for (const { path, name } of PAGES) {
    await page.goto(path);
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const box = (await h1.boundingBox())!;
    measurements[name] = {
      h1Top: Math.round(box.y),
      h1Left: Math.round(box.x),
      h1Size: await h1.evaluate((el) => getComputedStyle(el).fontSize),
      navTop: Math.round((await page.getByRole("navigation", { name: "main" }).boundingBox())!.y),
    };
  }

  const [first, ...rest] = Object.values(measurements);
  for (const m of rest) expect(m, JSON.stringify(measurements)).toEqual(first);
});

// Joe works on a 4K ultra-wide: nothing should run edge to edge
for (const width of [1280, 2560]) {
  test(`header, content and footer share one centered column at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1200 });
    for (const { path, name } of PAGES) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      const left = async (selector: string) => Math.round((await page.locator(selector).first().boundingBox())!.x);
      const right = async (selector: string) => {
        const box = (await page.locator(selector).first().boundingBox())!;
        return Math.round(box.x + box.width);
      };

      const label = `${name} at ${width}px`;
      // Where text actually sits: the content box inside the page padding
      const column = await page.locator("main > div").evaluate((el) => {
        const box = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const contentLeft = box.left + parseFloat(style.paddingLeft);
        const contentRight = box.right - parseFloat(style.paddingRight);
        return { left: Math.round(contentLeft), right: Math.round(contentRight), width: contentRight - contentLeft };
      });

      expect(await left("h1"), label).toBe(column.left);
      expect(await left("header a"), label).toBe(column.left);
      expect(await left("footer p"), label).toBe(column.left);
      expect(Math.abs((await right("nav ul")) - column.right), label).toBeLessThanOrEqual(1);

      // Body text stays under about 70 characters a line
      const ch = await page.evaluate(() => {
        const probe = document.createElement("span");
        probe.textContent = "0".repeat(100);
        document.querySelector("main")!.appendChild(probe);
        const width = probe.getBoundingClientRect().width / 100;
        probe.remove();
        return width;
      });
      const columnWidth = column.width;
      expect(columnWidth / ch, label).toBeLessThanOrEqual(72);
    }
  });
}
