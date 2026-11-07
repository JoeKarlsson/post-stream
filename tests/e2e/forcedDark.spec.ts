import { test, expect } from "@playwright/test";

// Phone browsers with their own dark mode (and Chromium's forced dark) recolor
// sites unless the site declares itself dark-only. Forced dark changes pixels,
// not computed styles, so compare what actually gets painted.
test("forced dark mode leaves the page colors alone", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("h1")).toBeVisible();

  const shot = await page.screenshot({ clip: { x: 2, y: 400, width: 4, height: 4 } });
  const painted = await page.evaluate(async (dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    return Array.from(ctx.getImageData(1, 1, 1, 1).data.slice(0, 3));
  }, `data:image/png;base64,${shot.toString("base64")}`);

  // --color-bg is #2a2937
  const expected = [0x2a, 0x29, 0x37];
  painted.forEach((channel, i) => expect(Math.abs(channel - expected[i])).toBeLessThanOrEqual(2));
});
