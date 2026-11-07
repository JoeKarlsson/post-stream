// After `vite build --mode demo`: write each demo user's posts to
// dist-demo/user/<name>.txt, the static stand-in for the server's
// /user/<name>.txt route. A snapshot of the starting data as of build time.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { CAST, STARTING_POSTS, TIMING } from '../app/demo/demoData.ts';

const require = createRequire(import.meta.url);
const { postsAsText } = require('../server/plainText.js');

const out = path.resolve(import.meta.dirname, '..', 'dist-demo', 'user');
fs.mkdirSync(out, { recursive: true });

const builtAt = Date.now();
for (const { username } of CAST) {
  const posts = STARTING_POSTS
    .filter(([author]) => author === username)
    .map(([userID, minutesAgo, body]) => ({ userID, body, createdAt: new Date(builtAt - minutesAgo * TIMING.MINUTE), editedAt: null }))
    .sort((a, b) => b.createdAt - a.createdAt);
  fs.writeFileSync(path.join(out, `${username}.txt`), postsAsText(username, posts));
}
console.log(`wrote ${CAST.length} plain-text profiles to dist-demo/user/`);
