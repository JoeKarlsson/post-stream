'use strict';

const pad = (n) => String(n).padStart(2, '0');

// "2026-11-06 19:17 UTC": the server can't know the reader's time zone
const utcTimestamp = (date) => {
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
};

// A user's posts as a plain-text log, one entry per post:
// [2026-11-06 19:17 UTC] <janedoe343>
// the post, as written
const postsAsText = (username, posts) => {
  const entries = posts.map((post) => {
    const edited = post.editedAt ? ' (edited)' : '';
    return `[${utcTimestamp(post.createdAt)}] <${post.userID}>${edited}\n${post.body}\n`;
  });
  return [`# ${username} on PostStream`, '', ...entries].join('\n');
};

module.exports = { utcTimestamp, postsAsText };
