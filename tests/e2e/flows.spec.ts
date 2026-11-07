import { test, expect } from "@playwright/test";
import { SEED_USERS, loginAs, query, watchForErrors } from "./helpers";

test("signing in: wrong password shows an error, right password logs in", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("email").fill(SEED_USERS.jane.email);
  await page.getByLabel("password").fill("not-the-password");
  await page.getByRole("button", { name: "sign in" }).click();
  await expect(page.getByRole("alert")).toHaveText("Invalid email or password");

  await page.getByLabel("password").fill("password123");
  await page.getByRole("button", { name: "sign in" }).click();
  await expect(page.locator("h1")).toHaveText("PostStream");
  await expect(page.getByRole("button", { name: "logout" })).toBeVisible();

  await page.getByRole("button", { name: "logout" }).click();
  await expect(page.getByRole("link", { name: "login" })).toBeVisible();
});

test("posting, editing, replying to and destroying your own post", async ({ page }) => {
  const errors = watchForErrors(page);
  const body = `e2e post ${Date.now()} ☕`;
  await loginAs(page, SEED_USERS.jane.email);
  await page.goto("/");

  await page.getByLabel("create a new post").fill(body);
  await page.getByRole("button", { name: "post", exact: true }).click();
  const post = page.locator("article", { hasText: body }).first();
  await expect(post).toBeVisible();

  await post.getByRole("button", { name: "edit" }).click();
  await post.getByLabel("edit your post").fill(`${body} (edited)`);
  await post.getByRole("button", { name: "save" }).click();
  await expect(post).toContainText(`${body} (edited)`);

  await post.getByRole("button", { name: "reply" }).click();
  await post.getByLabel("reply").fill("e2e reply");
  await post.getByRole("button", { name: "reply" }).click();
  await expect(post.locator(".replies")).toContainText("e2e reply");
  await expect(post.getByRole("button", { name: "1 comment" })).toBeVisible();

  await post.getByRole("button", { name: "destroy" }).click();
  await expect(page.getByText(body)).toHaveCount(0);
  expect(await query('SELECT id FROM "Posts" WHERE body LIKE $1', [`${body}%`])).toEqual([]);
  expect(errors).toEqual([]);
});

test("posts stop at 255 characters", async ({ page }) => {
  await loginAs(page, SEED_USERS.jane.email);
  await page.goto("/");
  const field = page.getByLabel("create a new post");
  await field.fill("x".repeat(300));
  await expect(field).toHaveValue("x".repeat(255));
});

test("comments open and close from the comment count", async ({ page }) => {
  await page.goto(`/user/${SEED_USERS.jane.username}`);
  const post = page.locator("article", { hasText: "Designing a new user interface" });
  await post.getByRole("button", { name: "3 comments" }).click();
  await expect(post.locator(".replies > div")).toHaveCount(3);
  await post.getByRole("button", { name: "3 comments" }).click();
  await expect(post.locator(".replies")).toHaveCount(0);
});

test("you can only edit and destroy your own posts", async ({ page }) => {
  await loginAs(page, SEED_USERS.jane.email);
  await page.goto(`/user/${SEED_USERS.john.username}`);
  await expect(page.locator("article").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "edit" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "destroy" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "reply" }).first()).toBeVisible();
});

test("following and unfollowing someone from their profile", async ({ page }) => {
  await loginAs(page, SEED_USERS.jane.email);
  await page.goto(`/user/${SEED_USERS.john.username}`);
  // Profiles never show follower counts
  await expect(page.getByText(/followers/)).toHaveCount(0);

  await page.getByRole("button", { name: "follow", exact: true }).click();
  await expect(page.getByRole("button", { name: "unfollow" })).toBeVisible();

  await page.goto(`/user/${SEED_USERS.jane.username}`);
  await expect(page.locator("dd", { hasText: SEED_USERS.john.username })).toBeVisible();

  await page.goto(`/user/${SEED_USERS.john.username}`);
  await page.getByRole("button", { name: "unfollow" }).click();
  await expect(page.getByRole("button", { name: "follow", exact: true })).toBeVisible();
});

test("editing your own profile, and not someone else's", async ({ page }) => {
  const [{ bio: originalBio }] = await query('SELECT bio FROM "Users" WHERE username = $1', [SEED_USERS.jane.username]);
  await loginAs(page, SEED_USERS.jane.email);

  try {
    await page.goto(`/user/${SEED_USERS.jane.username}`);
    await page.getByRole("link", { name: "edit profile" }).click();
    await page.getByLabel("bio").fill("bio set by the e2e tests");
    await page.getByRole("button", { name: "save" }).click();
    await expect(page.locator("h1")).toHaveText(SEED_USERS.jane.username);
    await expect(page.getByText("bio set by the e2e tests")).toBeVisible();
  } finally {
    await query('UPDATE "Users" SET bio = $1 WHERE username = $2', [originalBio, SEED_USERS.jane.username]);
  }

  // Someone else's edit page sends you back to their profile
  await page.goto(`/user/${SEED_USERS.john.username}/edit`);
  await expect(page).toHaveURL(`/user/${SEED_USERS.john.username}`);
});

test("creating an account logs you in", async ({ page }) => {
  const username = `e2e${Date.now()}`;
  try {
    await page.goto("/login");
    await page.getByRole("button", { name: "create an account" }).click();
    await page.getByLabel("username").fill(username);
    await page.getByLabel("first name").fill("End");
    await page.getByLabel("last name").fill("Toend");
    await page.getByLabel("email").fill(`${username}@example.com`);
    await page.getByLabel("password", { exact: true }).fill("testpass99");
    await page.getByLabel("confirm password").fill("testpass99");
    await page.getByRole("button", { name: "create account" }).click();

    await expect(page.locator("h1")).toHaveText("PostStream");
    await page.getByRole("link", { name: "profile" }).click();
    await expect(page.locator("h1")).toHaveText(username);
  } finally {
    await query('DELETE FROM "Users" WHERE username = $1', [username]);
  }
});

test("show more loads the next page of posts", async ({ page }) => {
  const marker = `e2e paging ${Date.now()}`;
  const token = (await (await page.request.post("/auth/login", {
    data: { email: SEED_USERS.jane.email, password: "password123" },
  })).json()).token;
  // Enough posts that the feed needs a second page
  for (let i = 0; i < 11; i++) {
    await page.request.post("/post/new", {
      headers: { Authorization: `Bearer ${token}` },
      data: { body: `${marker} #${i}` },
    });
  }

  try {
    await page.goto("/");
    await expect(page.locator("article")).toHaveCount(10);
    await page.getByRole("button", { name: "show more" }).click();
    await expect.poll(() => page.locator("article").count()).toBeGreaterThan(10);
    // The oldest test post (#0) is on the second page
    await expect(page.getByText(`${marker} #0`)).toBeVisible();
  } finally {
    await query('DELETE FROM "Posts" WHERE body LIKE $1', [`${marker}%`]);
  }
});
