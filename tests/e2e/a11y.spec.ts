import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PAGES, SEED_USERS, loginAs } from "./helpers";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"];

const expectNoViolations = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
};

for (const { path, name } of PAGES) {
  test(`${name} page has no axe violations`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForLoadState("networkidle");
    await expectNoViolations(page);
  });
}

test("logged-in feed, open comments and edit profile have no axe violations", async ({ page }) => {
  await loginAs(page, SEED_USERS.jane.email);
  await page.goto("/");
  await page.getByRole("button", { name: /comment/ }).nth(1).click();
  await expect(page.locator(".replies").first()).toBeVisible();
  await expectNoViolations(page);

  await page.goto(`/user/${SEED_USERS.jane.username}/edit`);
  await expect(page.locator("h1")).toHaveText("edit profile");
  await expectNoViolations(page);
});

test("register form with validation errors has no axe violations", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "create an account" }).click();
  await page.getByRole("button", { name: "create account" }).click();
  await expect(page.locator("[aria-invalid=true]").first()).toBeVisible();
  await expectNoViolations(page);
});
