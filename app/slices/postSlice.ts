import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Post, Comment } from "../types";
import { authJsonHeaders, readJsonOrThrow } from "./http";

// Matches the server-side validation in server/models/post.js
export const MAX_POST_LENGTH = 2048;
// The stream shows this much of a post, then "read more"
export const PREVIEW_LENGTH = 256;

// Each thunk turns a failed request into a rejected action carrying the server's message
const request = async (url: string, init?: RequestInit) =>
  readJsonOrThrow(await fetch(url, init));

const thunk = <Arg, Result>(type: string, run: (arg: Arg) => Promise<Result>) =>
  createAsyncThunk<Result, Arg, { rejectValue: string }>(type, async (arg, { rejectWithValue }) => {
    try {
      return await run(arg);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  });

// The server sends this many posts per page
export const PAGE_SIZE = 10;

// No username: your following feed (needs you logged in). With one: that
// user's posts (profile page). PostStream has no global feed.
const fetchPostPage = (username: string | undefined, offset: number) =>
  username
    ? request(`/post/user/${encodeURIComponent(username)}?offset=${offset}`)
    : request(`/post/feed?offset=${offset}`, { headers: authJsonHeaders() });

export const fetchPosts = thunk("posts/fetchPosts", (username: string | undefined) =>
  fetchPostPage(username, 0) as Promise<Post[]>
);

// The next page after what's already loaded
export const fetchMorePosts = thunk(
  "posts/fetchMorePosts",
  ({ username, offset }: { username?: string; offset: number }) =>
    fetchPostPage(username, offset) as Promise<Post[]>
);

// One post with its replies open, for its permalink page
export const fetchPost = thunk("posts/fetchPost", async (id: number) => ({
  post: (await request(`/post/${id}`)) as Post,
  comments: (await request(`/post/${id}/comments`)) as Comment[],
}));

export const createPost = thunk("posts/createPost", ({ body }: { body: string }) =>
  request("/post/new", {
    method: "POST",
    headers: authJsonHeaders(),
    body: JSON.stringify({ body }),
  }) as Promise<Post>
);

export const updatePost = thunk("posts/updatePost", ({ id, body }: { id: number; body: string }) =>
  request(`/post/${id}/edit`, {
    method: "PUT",
    headers: authJsonHeaders(),
    body: JSON.stringify({ body }),
  }) as Promise<Post>
);

export const deletePost = thunk("posts/deletePost", async (id: number) => {
  await request(`/post/${id}`, { method: "DELETE", headers: authJsonHeaders() });
  return id;
});

export const fetchComments = thunk("posts/fetchComments", async (postId: number) => ({
  postId,
  comments: (await request(`/post/${postId}/comments`)) as Comment[],
}));

// A contextual response: kind from shared/contextualResponses.mjs, plus the
// detail text for kinds that take one
export const createReply = thunk(
  "posts/createReply",
  async ({ postId, kind, detail }: { postId: number; kind: string; detail: string }) => ({
    postId,
    comment: (await request(`/post/${postId}/comments/0/new`, {
      method: "POST",
      headers: authJsonHeaders(),
      body: JSON.stringify({ kind, detail }),
    })) as Comment,
  })
);

// A post plus the UI state the feed keeps for it
export interface FeedPost extends Post {
  comments: Comment[];
  showComments: boolean;
  editMode: boolean;
  updatedPostBody: string;
  replyMode: boolean;
  replyKind: string;
  replyDetail: string;
  expanded: boolean;
}

const toFeedPost = (post: Post): FeedPost => ({
  ...post,
  comments: [],
  showComments: false,
  editMode: false,
  updatedPostBody: post.body,
  replyMode: false,
  replyKind: "",
  replyDetail: "",
  expanded: false,
});

interface PostState {
  posts: FeedPost[];
  isFetchingPosts: boolean;
  hasMore: boolean;
  submittingNewPost: boolean;
  lastUpdated: number | null;
  newPostBody: string;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  isFetchingPosts: false,
  hasMore: false,
  submittingNewPost: false,
  lastUpdated: null,
  newPostBody: "",
  error: null,
};

const findPost = (state: PostState, id: number) => state.posts.find((post) => post.id === id);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setNewPostBody: (state, action: PayloadAction<string>) => {
      state.newPostBody = action.payload;
    },
    toggleEditMode: (state, action: PayloadAction<{ index: number; editState: boolean }>) => {
      const post = state.posts[action.payload.index];
      if (post) {
        post.editMode = action.payload.editState;
        post.updatedPostBody = post.body;
      }
    },
    updatePostBody: (state, action: PayloadAction<{ index: number; body: string }>) => {
      const post = state.posts[action.payload.index];
      if (post) post.updatedPostBody = action.payload.body;
    },
    toggleShowComment: (
      state,
      action: PayloadAction<{ index: number; showCommentState: boolean }>
    ) => {
      const post = state.posts[action.payload.index];
      if (post) post.showComments = action.payload.showCommentState;
    },
    toggleReplyMode: (state, action: PayloadAction<number>) => {
      const post = state.posts[action.payload];
      if (post) post.replyMode = !post.replyMode;
    },
    // Pick a contextual response (kind) and/or type its detail
    updateReply: (
      state,
      action: PayloadAction<{ index: number; kind?: string; detail?: string }>
    ) => {
      const post = state.posts[action.payload.index];
      if (!post) return;
      if (action.payload.kind !== undefined) post.replyKind = action.payload.kind;
      if (action.payload.detail !== undefined) post.replyDetail = action.payload.detail;
    },
    toggleExpanded: (state, action: PayloadAction<number>) => {
      const post = state.posts[action.payload];
      if (post) post.expanded = !post.expanded;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isFetchingPosts = true;
        state.posts = [];
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isFetchingPosts = false;
        state.lastUpdated = Date.now();
        state.posts = action.payload.map(toFeedPost);
        state.hasMore = action.payload.length === PAGE_SIZE;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.isFetchingPosts = false;
      })

      .addCase(fetchMorePosts.pending, (state) => {
        state.isFetchingPosts = true;
      })
      .addCase(fetchMorePosts.fulfilled, (state, action) => {
        state.isFetchingPosts = false;
        // Skip any post already shown (one posted since the first page loaded)
        const shown = new Set(state.posts.map((post) => post.id));
        state.posts.push(...action.payload.filter((post) => !shown.has(post.id)).map(toFeedPost));
        state.hasMore = action.payload.length === PAGE_SIZE;
      })
      .addCase(fetchMorePosts.rejected, (state) => {
        state.isFetchingPosts = false;
      })

      .addCase(createPost.pending, (state) => {
        state.submittingNewPost = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.submittingNewPost = false;
        state.newPostBody = "";
        state.posts.unshift(toFeedPost(action.payload));
      })
      .addCase(createPost.rejected, (state) => {
        state.submittingNewPost = false;
      })

      .addCase(updatePost.fulfilled, (state, action) => {
        const post = findPost(state, action.payload.id);
        if (post) {
          post.body = action.payload.body;
          post.editedAt = action.payload.editedAt;
          post.editMode = false;
        }
      })

      .addCase(fetchPost.pending, (state) => {
        state.isFetchingPosts = true;
        state.posts = [];
        state.hasMore = false;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.isFetchingPosts = false;
        // A permalink shows the whole post with its replies open
        state.posts = [
          { ...toFeedPost(action.payload.post), comments: action.payload.comments, showComments: true, expanded: true },
        ];
      })
      .addCase(fetchPost.rejected, (state) => {
        state.isFetchingPosts = false;
      })

      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        const post = findPost(state, action.payload.postId);
        if (post) {
          post.comments = action.payload.comments;
          post.showComments = true;
        }
      })

      .addCase(createReply.fulfilled, (state, action) => {
        const post = findPost(state, action.payload.postId);
        if (post) {
          post.commentCount = (post.commentCount ?? 0) + 1;
          post.comments = [...post.comments, action.payload.comment];
          post.replyKind = "";
          post.replyDetail = "";
          post.replyMode = false;
          post.showComments = true;
        }
      })

      // Any failed request shows its message above the post list
      .addMatcher(
        (action): action is PayloadAction<string> =>
          action.type.startsWith("posts/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload ?? "Something went wrong";
        }
      );
  },
});

export const {
  setNewPostBody,
  toggleEditMode,
  updatePostBody,
  toggleShowComment,
  toggleReplyMode,
  updateReply,
  toggleExpanded,
  clearError,
} = postSlice.actions;

export default postSlice.reducer;
