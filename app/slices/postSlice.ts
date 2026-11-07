import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Post, Comment } from "../types";
import { authJsonHeaders, readJsonOrThrow } from "./http";

// Matches the VARCHAR(255) body column and the server-side validation
export const MAX_POST_LENGTH = 255;

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

// No username: the main feed. With one: that user's posts (profile page).
const postsUrl = (username: string | undefined, offset: number) =>
  `${username ? `/post/user/${encodeURIComponent(username)}` : "/post"}?offset=${offset}`;

export const fetchPosts = thunk("posts/fetchPosts", (username: string | undefined) =>
  request(postsUrl(username, 0)) as Promise<Post[]>
);

// The next page after what's already loaded
export const fetchMorePosts = thunk(
  "posts/fetchMorePosts",
  ({ username, offset }: { username?: string; offset: number }) =>
    request(postsUrl(username, offset)) as Promise<Post[]>
);

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

export const createReply = thunk(
  "posts/createReply",
  async ({ postId, body }: { postId: number; body: string }) => ({
    postId,
    comment: (await request(`/post/${postId}/comments/0/new`, {
      method: "POST",
      headers: authJsonHeaders(),
      body: JSON.stringify({ body }),
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
  replyBody: string;
}

const toFeedPost = (post: Post): FeedPost => ({
  ...post,
  comments: [],
  showComments: false,
  editMode: false,
  updatedPostBody: post.body,
  replyMode: false,
  replyBody: "",
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
    updateReplyBody: (state, action: PayloadAction<{ index: number; body: string }>) => {
      const post = state.posts[action.payload.index];
      if (post) post.replyBody = action.payload.body;
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
          post.editMode = false;
        }
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
          post.replyBody = "";
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
  updateReplyBody,
  clearError,
} = postSlice.actions;

export default postSlice.reducer;
