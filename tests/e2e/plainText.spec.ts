import { test, expect } from "@playwright/test";
import { SEED_USERS, loginAs } from "./helpers";

test("posts and replies are headed like log lines, with a date", async ({ page }) => {
  await page.goto(`/user/${SEED_USERS.jane.username}`);
  const firstLine = page.locator("article time").first();
  await expect(firstLine).toHaveText(/^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}\]$/);
  await expect(page.locator("article").first()).toContainText(`<${SEED_USERS.jane.username}>`);
});

test("profiles read like finger output", async ({ page }) => {
  await page.goto(`/user/${SEED_USERS.jane.username}`);
  for (const label of ["Login:", "Name:", "Joined:", "Follows:", "Plan:"]) {
    await expect(page.locator("dt", { hasText: label })).toBeVisible();
  }
});

test("the post box counts characters as you type", async ({ page }) => {
  await loginAs(page, SEED_USERS.jane.email);
  await page.goto("/");
  const field = page.getByLabel("create a new post");
  await field.fill("x".repeat(128));
  await expect(page.locator("#new-post-count")).toContainText("128/2048");
  // Screen readers get the count as the field's description
  await expect(field).toHaveAccessibleDescription(/128\/2048 characters/);
});

test("j/k move between posts and n jumps to the post box, until keys are turned off", async ({ page }) => {
  await loginAs(page, SEED_USERS.jane.email);
  await page.goto("/");
  await expect(page.locator("article").nth(1)).toBeVisible();

  await page.keyboard.press("j");
  await expect(page.locator("article").first()).toBeFocused();
  await page.keyboard.press("j");
  await expect(page.locator("article").nth(1)).toBeFocused();
  await page.keyboard.press("k");
  await expect(page.locator("article").first()).toBeFocused();

  await page.keyboard.press("n");
  await expect(page.getByLabel("create a new post")).toBeFocused();
  // Typing in the box doesn't trigger shortcuts
  await page.keyboard.type("jk");
  await expect(page.getByLabel("create a new post")).toHaveValue("jk");

  await page.getByRole("button", { name: "turn keys off" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "turn keys on" })).toBeVisible();
  await page.keyboard.press("j");
  await expect(page.locator("article").first()).not.toBeFocused();
  await page.getByRole("button", { name: "turn keys on" }).click();
});
