// The static demo's stand-in for the API (npm run build:demo). It answers the
// same /post and /auth requests the Express server does, from data kept in
// this browser's localStorage, so the demo works on GitHub Pages with no
// server. A small simulator has the cast post and reply while you look around.
import { composeResponse } from "../../shared/contextualResponses.mjs";
import {
  CAST,
  POST_POOL,
  REPLY_POOL,
  STARTING_FOLLOWS,
  STARTING_POSTS,
  STARTING_REPLIES,
  TIMING,
  VISITOR,
  DemoUser,
} from "./demoData";

const STORAGE_KEY = "poststream:demo:v1";
const PAGE_SIZE = 10;
const MAX_POST_LENGTH = 2048;

interface StoredUser extends DemoUser {
  id: number;
  email: string;
  createdAt: string;
}
interface StoredPost {
  id: number;
  body: string;
  userID: string;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  editedAt: string | null;
}
interface StoredComment {
  id: number;
  body: string;
  kind: string | null;
  userID: string;
  PostId: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}
interface DemoState {
  users: StoredUser[];
  posts: StoredPost[];
  comments: StoredComment[];
  follows: [string, string][];
  nextId: number;
  poolIndex: number;
}

// ---- state ---------------------------------------------------------------

const iso = (msAgo = 0) => new Date(Date.now() - msAgo).toISOString();

const freshState = (): DemoState => {
  let nextId = 1;
  const users: StoredUser[] = [VISITOR, ...CAST].map((user, i) => ({
    ...user,
    id: nextId++,
    email: `${user.username}@example.com`,
    createdAt: iso((30 - i) * 24 * TIMING.HOUR),
  }));
  const posts: StoredPost[] = STARTING_POSTS.map(([userID, minutesAgo, body]) => {
    const at = iso(minutesAgo * TIMING.MINUTE);
    return { id: nextId++, body, userID, commentCount: 0, createdAt: at, updatedAt: at, editedAt: null };
  });
  const comments: StoredComment[] = STARTING_REPLIES.map(([postIndex, userID, kind, detail]) => {
    const post = posts[postIndex];
    post.commentCount += 1;
    // A little after the post itself
    const at = new Date(new Date(post.createdAt).getTime() + (post.commentCount * 7 + 3) * TIMING.MINUTE).toISOString();
    return { id: nextId++, body: composeResponse(kind, detail).body!, kind, userID, PostId: post.id, commentCount: 0, createdAt: at, updatedAt: at };
  });
  // The visitor follows everyone, so the home feed is full from the start
  const follows: [string, string][] = [...CAST.map((u): [string, string] => [VISITOR.username, u.username]), ...STARTING_FOLLOWS];
  return { users, posts, comments, follows, nextId, poolIndex: 0 };
};

let state: DemoState;

const load = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    state = saved ? JSON.parse(saved) : freshState();
  } catch {
    state = freshState(); // storage blocked or corrupt: start over in memory
  }
};

const save = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage blocked: the demo still works until the page reloads
  }
};

export const resetDemo = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("poststream:demo:started");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch {
    // nothing stored to clear
  }
  window.location.assign("/");
};

// ---- auth ----------------------------------------------------------------

// The app only decodes the token (for its expiry), so an unsigned one is fine here
const base64url = (value: object) =>
  btoa(JSON.stringify(value)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
const tokenFor = (user: StoredUser) =>
  `${base64url({ alg: "none", typ: "JWT" })}.${base64url({
    id: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
  })}.demo`;

const publicUser = ({ id, username, email, first_name, last_name, bio, createdAt }: StoredUser) => ({
  id, username, email, first_name, last_name, bio, isActive: true, createdAt, updatedAt: createdAt,
});

const signIn = (user: StoredUser) => {
  localStorage.setItem("token", tokenFor(user));
  localStorage.setItem("user", JSON.stringify(publicUser(user)));
};

const currentUser = (headers: Headers): StoredUser | null => {
  const token = headers.get("Authorization")?.replace(/^Bearer /, "");
  if (!token) return null;
  try {
    const { username } = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return state.users.find((u) => u.username === username) ?? null;
  } catch {
    return null;
  }
};

// ---- the routes ----------------------------------------------------------

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const fail = (status: number, error: string) => json({ error }, status);

const newestFirst = (a: StoredPost, b: StoredPost) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id;
const page = (posts: StoredPost[], url: URL) => {
  const offset = Math.max(0, Number.parseInt(url.searchParams.get("offset") ?? "0", 10) || 0);
  return [...posts].sort(newestFirst).slice(offset, offset + PAGE_SIZE);
};
const following = (username: string) => state.follows.filter(([f]) => f === username).map(([, to]) => to);
const followers = (username: string) => state.follows.filter(([, to]) => to === username).map(([f]) => f);

type Handler = (req: { url: URL; method: string; body: Record<string, string>; me: StoredUser | null; params: string[] }) => Response;

const routes: [string, RegExp, Handler][] = [
  ["POST", /^\/auth\/login$/, () => {
    // Any email and password sign you in as the demo visitor
    const visitor = state.users.find((u) => u.username === VISITOR.username)!;
    return json({ success: true, token: tokenFor(visitor), user: publicUser(visitor) });
  }],
  ["POST", /^\/auth\/register$/, ({ body }) => {
    if (!/^[a-zA-Z0-9]{3,20}$/.test(body.username ?? "")) return fail(400, "Username must be 3 to 20 letters or numbers");
    if (state.users.some((u) => u.username === body.username)) return fail(400, "User with this email or username already exists");
    const user: StoredUser = {
      id: state.nextId++, username: body.username, email: body.email, first_name: body.first_name ?? "",
      last_name: body.last_name ?? "", bio: body.bio ?? "", createdAt: iso(),
    };
    state.users.push(user);
    state.follows.push(...CAST.map((u): [string, string] => [user.username, u.username]));
    return json({ success: true, token: tokenFor(user), user: publicUser(user) }, 201);
  }],
  ["PUT", /^\/auth\/profile$/, ({ me, body }) => {
    if (!me) return fail(401, "Unauthorized");
    Object.assign(me, { first_name: body.first_name, last_name: body.last_name, bio: body.bio });
    return json({ success: true, user: publicUser(me) });
  }],
  ["GET", /^\/auth\/users$/, () =>
    json([...state.users].sort((a, b) => (a.username < b.username ? -1 : 1))
      .map(({ username, first_name, last_name }) => ({ username, first_name, last_name })))],
  ["GET", /^\/auth\/user\/([^/]+)$/, ({ params: [username] }) => {
    const user = state.users.find((u) => u.username === username);
    if (!user) return fail(404, "User not found");
    const { id, first_name, last_name, bio, createdAt } = user;
    return json({ success: true, user: { id, username, first_name, last_name, bio, createdAt, followers: followers(username), following: following(username) } });
  }],
  ["POST", /^\/auth\/user\/([^/]+)\/follow$/, ({ me, params: [username] }) => {
    if (!me) return fail(401, "Unauthorized");
    if (username === me.username) return fail(400, "You cannot follow yourself");
    if (!state.follows.some(([f, t]) => f === me.username && t === username)) state.follows.push([me.username, username]);
    return json({ success: true });
  }],
  ["DELETE", /^\/auth\/user\/([^/]+)\/follow$/, ({ me, params: [username] }) => {
    if (!me) return fail(401, "Unauthorized");
    state.follows = state.follows.filter(([f, t]) => !(f === me.username && t === username));
    return json({ success: true });
  }],
  ["GET", /^\/post\/feed$/, ({ me, url }) => {
    if (!me) return fail(401, "Unauthorized");
    const authors = new Set([me.username, ...following(me.username)]);
    return json(page(state.posts.filter((p) => authors.has(p.userID)), url));
  }],
  ["GET", /^\/post\/user\/([^/]+)$/, ({ url, params: [username] }) => json(page(state.posts.filter((p) => p.userID === username), url))],
  ["POST", /^\/post\/new$/, ({ me, body }) => {
    if (!me) return fail(401, "Unauthorized");
    const text = body.body ?? "";
    if (text.length < 1 || text.length > MAX_POST_LENGTH) return fail(400, "Posts must be 1 to 2048 characters");
    const post = addPost(me.username, text);
    replySoon(post);
    return json(post);
  }],
  ["GET", /^\/post\/(\d+)$/, ({ params: [id] }) => {
    const post = state.posts.find((p) => p.id === Number(id));
    return post ? json(post) : fail(404, "Post not found");
  }],
  ["DELETE", /^\/post\/(\d+)$/, ({ me, params: [id] }) => {
    const post = state.posts.find((p) => p.id === Number(id));
    if (!post) return fail(404, "Post not found");
    if (post.userID !== me?.username) return fail(403, "You can only change your own posts");
    state.posts = state.posts.filter((p) => p !== post);
    state.comments = state.comments.filter((c) => c.PostId !== post.id);
    return json({ success: true });
  }],
  ["PUT", /^\/post\/(\d+)\/edit$/, ({ me, body, params: [id] }) => {
    const post = state.posts.find((p) => p.id === Number(id));
    if (!post) return fail(404, "Post not found");
    if (post.userID !== me?.username) return fail(403, "You can only change your own posts");
    if (!body.body || body.body.length > MAX_POST_LENGTH) return fail(400, "Posts must be 1 to 2048 characters");
    Object.assign(post, { body: body.body, editedAt: iso(), updatedAt: iso() });
    return json(post);
  }],
  ["GET", /^\/post\/(\d+)\/comments$/, ({ params: [id] }) =>
    json(state.comments.filter((c) => c.PostId === Number(id)).sort((a, b) => a.createdAt.localeCompare(b.createdAt)))],
  ["POST", /^\/post\/(\d+)\/comments\/\d+\/new$/, ({ me, body, params: [id] }) => {
    if (!me) return fail(401, "Unauthorized");
    const post = state.posts.find((p) => p.id === Number(id));
    if (!post) return fail(404, "Post not found");
    const { body: text, error } = composeResponse(body.kind, body.detail);
    if (error) return fail(400, error);
    return json(addReply(post, me.username, body.kind, text!));
  }],
];

const handle = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url, window.location.origin);
  const method = (init.method ?? "GET").toUpperCase();
  for (const [routeMethod, pattern, handler] of routes) {
    const match = routeMethod === method ? pattern.exec(url.pathname) : null;
    if (match) {
      load(); // another tab may have changed things
      const body = typeof init.body === "string" ? JSON.parse(init.body) : {};
      const response = handler({ url, method, body, me: currentUser(new Headers(init.headers)), params: match.slice(1) });
      save();
      return response;
    }
  }
  return fail(404, `The demo has no ${method} ${url.pathname}`);
};

// ---- the cast, posting while you look around -----------------------------

const between = ([min, max]: readonly [number, number]) => min + Math.random() * (max - min);
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function addPost(userID: string, body: string): StoredPost {
  const now = iso();
  const post = { id: state.nextId++, body, userID, commentCount: 0, createdAt: now, updatedAt: now, editedAt: null };
  state.posts.push(post);
  return post;
}

function addReply(post: StoredPost, userID: string, kind: string, body: string): StoredComment {
  const now = iso();
  const comment = { id: state.nextId++, body, kind, userID, PostId: post.id, commentCount: 0, createdAt: now, updatedAt: now };
  state.comments.push(comment);
  post.commentCount += 1;
  post.updatedAt = now;
  return comment;
}

const castReply = (post: StoredPost) => {
  const [kind, detail] = pick(REPLY_POOL);
  const author = pick(CAST.filter((u) => u.username !== post.userID)).username;
  addReply(post, author, kind, composeResponse(kind, detail).body!);
};

// Someone answers the visitor's own post a few seconds after it goes up
function replySoon(post: StoredPost) {
  window.setTimeout(() => {
    load();
    const stillThere = state.posts.find((p) => p.id === post.id);
    if (stillThere) {
      castReply(stillThere);
      save();
    }
  }, between(TIMING.replyToVisitorMs));
}

const castActs = () => {
  load();
  if (Math.random() < 0.6) {
    const [author, body] = POST_POOL[state.poolIndex % POST_POOL.length];
    state.poolIndex += 1;
    addPost(author, body);
  } else {
    const recent = [...state.posts].sort(newestFirst).slice(0, 8);
    if (recent.length) castReply(pick(recent));
  }
  save();
  window.setTimeout(castActs, between(TIMING.activityEveryMs));
};

// ---- install -------------------------------------------------------------

export const installDemo = () => {
  load();
  // Signed in as the visitor from the first visit (logging out still works)
  try {
    if (!localStorage.getItem("poststream:demo:started")) {
      signIn(state.users.find((u) => u.username === VISITOR.username)!);
      localStorage.setItem("poststream:demo:started", "1");
    }
  } catch {
    // storage blocked: the visitor can still sign in from the login page
  }
  save();

  const realFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const path = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url, window.location.origin).pathname;
    return /^\/(post|auth)\//.test(path) ? handle(input, init) : realFetch(input, init);
  };

  window.setTimeout(castActs, between(TIMING.activityEveryMs));
};
