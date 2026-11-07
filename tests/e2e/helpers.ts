import { Page, expect } from "@playwright/test";
import pg from "pg";
import serverConfig from "../../server/config/config.js";

const dbConfig = serverConfig.development;

// Every page type, as a logged-out visitor sees it
export const PAGES = [
  { path: "/", name: "feed" },
  { path: "/user/johndoe131", name: "profile" },
  { path: "/about", name: "about" },
  { path: "/login", name: "login" },
  { path: "/no-such-page", name: "404" },
];

export const SEED_USERS = {
  john: { email: "john@example.com", username: "johndoe131" },
  jane: { email: "jane@example.com", username: "janedoe343" },
};

// Logs in through the API and stores the session the way the app does
export const loginAs = async (page: Page, email: string) => {
  const response = await page.request.post("/auth/login", {
    data: { email, password: "password123" },
  });
  expect(response.ok()).toBeTruthy();
  const { token, user } = await response.json();
  await page.addInitScript(
    ([t, u]) => {
      localStorage.setItem("token", t);
      localStorage.setItem("user", u);
    },
    [token, JSON.stringify(user)]
  );
};

// Collects console errors and failed requests so a test can assert there were none
export const watchForErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`page: ${err.message}`));
  page.on("requestfailed", (req) => errors.push(`request: ${req.url()} ${req.failure()?.errorText}`));
  page.on("response", (res) => {
    if (res.status() >= 500) errors.push(`response: ${res.status()} ${res.url()}`);
  });
  return errors;
};

// For cleaning up rows the tests create (there are no delete-user or admin APIs)
export const query = async (sql: string, params: unknown[] = []) => {
  const client = new pg.Client({
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    host: dbConfig.host,
    port: dbConfig.port,
  });
  await client.connect();
  try {
    return (await client.query(sql, params)).rows;
  } finally {
    await client.end();
  }
};
