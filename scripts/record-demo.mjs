// Records the README / joekarlsson.com video of the static demo, plus the
// poster frame and an about-page screenshot. Usage:
//
//   npm run build:demo
//   npx vite preview --mode demo --port 4174 &
//   node scripts/record-demo.mjs [outDir]
//
// Writes poststream.webm (convert with ffmpeg), poster.png and about.png.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const BASE = process.env.DEMO_URL ?? 'http://localhost:4174';
const out = path.resolve(process.argv[2] ?? 'recording');
fs.mkdirSync(out, { recursive: true });

const size = { width: 960, height: 540 };
const browser = await chromium.launch();
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

// The video: a fresh visitor, so the demo starts from its sample data
// bypassCSP: the demo's CSP (rightly) blocks the injected <style> below
const context = await browser.newContext({ viewport: size, recordVideo: { dir: out, size }, bypassCSP: true });
const page = await context.newPage();
// Hide the demo banner in the video; the page around it explains the demo
await page.addInitScript(() => {
  // Init scripts can run before <head> exists; wait for it
  const hideBanner = () => {
    if (!document.head) return setTimeout(hideBanner, 0);
    const style = document.createElement('style');
    style.textContent = '[class*="banner"] { display: none !important; }';
    document.head.append(style);
  };
  hideBanner();
});

await page.goto(BASE);
await page.locator('article').first().waitFor();
await page.screenshot({ path: path.join(out, 'poster.png') });
await pause(1500);

const box = page.getByLabel('create a new post');
await box.click();
await box.pressSequentially('a quiet place to say one thing at a time. no likes, no counts, just this.', { delay: 45 });
await pause(600);
await page.getByRole('button', { name: 'post', exact: true }).click();
await pause(1500);

// A contextual reply on someone else's post
await page.mouse.wheel(0, 420);
await pause(700);
const post = page.locator('article', { hasText: 'Second coffee' });
await post.getByRole('button', { name: 'reply' }).click();
await pause(500);
await post.getByRole('radio', { name: 'agree, because ...', exact: true }).check();
await pause(400);
await post.getByRole('textbox').pressSequentially('it is always the third one', { delay: 45 });
await pause(400);
await post.getByRole('button', { name: 'send reply' }).click();
await pause(1500);

// Down through the stream
for (let i = 0; i < 6; i += 1) {
  await page.mouse.wheel(0, 260);
  await pause(350);
}
await pause(600);

// The about page is a man page
await page.getByRole('link', { name: 'about' }).first().click();
await page.locator('h1').waitFor();
await pause(1200);
for (let i = 0; i < 3; i += 1) {
  await page.mouse.wheel(0, 220);
  await pause(450);
}
await pause(1000);

const video = await page.video().path();
await context.close();
fs.renameSync(video, path.join(out, 'poststream.webm'));

// The about-page still, at 2x like the site's other screenshots
const stills = await browser.newContext({ viewport: { width: 800, height: 656 }, deviceScaleFactor: 2, bypassCSP: true });
const about = await stills.newPage();
await about.addInitScript(() => {
  // Init scripts can run before <head> exists; wait for it
  const hideBanner = () => {
    if (!document.head) return setTimeout(hideBanner, 0);
    const style = document.createElement('style');
    style.textContent = '[class*="banner"] { display: none !important; }';
    document.head.append(style);
  };
  hideBanner();
});
await about.goto(`${BASE}/about`);
await about.locator('h1').waitFor();
await about.screenshot({ path: path.join(out, 'about.png') });
await stills.close();

await browser.close();
console.log(`recorded to ${out}`);
