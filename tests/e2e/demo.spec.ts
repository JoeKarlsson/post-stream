import { test, expect } from "@playwright/test";

// The static demo build (npm run build:demo), served with no API at all
test("the static demo signs you in and works with no server", async ({ page }) => {
  const apiCalls: string[] = [];
  page.on("request", (req) => {
    if (/\/(post|auth)\//.test(new URL(req.url()).pathname)) apiCalls.push(req.url());
  });

  await page.goto("/");
  await expect(page.getByText("archived demo: there's no server")).toBeVisible();
  await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
  await expect(page.locator("article").first()).toBeVisible();

  // Posting works, and nothing goes over the network
  await page.getByLabel("create a new post").fill("posting from the demo test");
  await page.getByRole("button", { name: "post", exact: true }).click();
  await expect(page.locator("article").first()).toContainText("posting from the demo test");
  expect(apiCalls).toEqual([]);

  // Deep links load the app (Pages serves 404.html for them)
  await page.goto("/people");
  await expect(page.getByRole("link", { name: "tamsinreads" })).toBeVisible();

  await page.getByRole("button", { name: "reset demo" }).click();
  await expect(page.locator("article", { hasText: "posting from the demo test" })).toHaveCount(0);
});

test("the demo's plain-text profiles are real files", async ({ request }) => {
  const res = await request.get("/user/tamsinreads.txt");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain("# tamsinreads on PostStream");
});
