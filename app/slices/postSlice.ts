import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Post, Comment } from "../types";
import { logError } from "../utils/errorLogger";

// Async thunks for API calls
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/post");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (
    postData: { body: string; user_id: number; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/post/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `body=${encodeURIComponent(postData.body)}&userID=${
          postData.user_id
        }`,
      });
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      const data = await response.json();
      return {
        post: data,
        userData: { name: postData.name, user_id: postData.user_id },
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, body }: { id: number; body: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/post/${id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `body=${encodeURIComponent(body)}`,
      });
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/post/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/post/${postId}/comments`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      return { comments: data, postId };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const createReply = createAsyncThunk(
  "posts/createReply",
  async (
    {
      postId,
      body,
      user_id,
    }: { postId: number; body: string; user_id: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/post/${postId}/comments/0/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `body=${encodeURIComponent(body)}&userID=${user_id}`,
      });
      if (!response.ok) {
        throw new Error("Failed to create reply");
      }
      const data = await response.json();
      return { comment: data, postId };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

interface PostState {
  posts: Post[];
  isFetchingPosts: boolean;
  isFetchingComments: boolean;
  isDestroyingPost: boolean;
  submittingNewPost: boolean;
  isSubmittingReply: boolean;
  didInvalidate: boolean;
  lastUpdated: number | null;
  newPostBody: string;
  receivedAt: number | null;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  isFetchingPosts: false,
  isFetchingComments: false,
  isDestroyingPost: false,
  submittingNewPost: false,
  isSubmittingReply: false,
  didInvalidate: false,
  lastUpdated: null,
  newPostBody: "",
  receivedAt: null,
  error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setNewPostBody: (state, action: PayloadAction<string>) => {
      state.newPostBody = action.payload;
    },
    toggleEditMode: (
      state,
      action: PayloadAction<{ index: number; editState: boolean }>
    ) => {
      const post = state.posts[action.payload.index];
      if (post) {
        post.editMode = action.payload.editState;
      }
    },
    updatePostBody: (
      state,
      action: PayloadAction<{ index: number; body: string }>
    ) => {
      const post = state.posts[action.payload.index];
      if (post) {
        post.updatedPostBody = action.payload.body;
      }
    },
    toggleComment: (
      state,
      action: PayloadAction<{ index: number; newChildId: number }>
    ) => {
      const post = state.posts[action.payload.index];
      if (post) {
        post.childId = action.payload.newChildId;
        post.childContext = post.comments?.[action.payload.newChildId] || null;
      }
    },
    toggleShowComment: (
      state,
      action: PayloadAction<{ index: number; showCommentState: boolean }>
    ) => {
      const post = state.posts[action.payload.index];
      if (post) {
        post.showComments = action.payload.showCommentState;
      }
    },
    toggleReplyMode: (state, action: PayloadAction<number>) => {
      const post = state.posts[action.payload];
      if (post) {
        post.replyMode = !post.replyMode;
      }
    },
    updateReplyBody: (
      state,
      action: PayloadAction<{ index: number; body: string }>
    ) => {
      const post = state.posts[action.payload.index];
      if (post) {
        post.replyBody = action.payload.body;
      }
    },
    clearError: (state) => {
      state.error = null;
      state.didInvalidate = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isFetchingPosts = true;
        state.didInvalidate = false;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isFetchingPosts = false;
        state.didInvalidate = false;
        state.lastUpdated = Date.now();
        state.receivedAt = Date.now();

        try {
          const parsedPosts = Array.isArray(action.payload)
            ? action.payload
            : [];
          state.posts = parsedPosts.map((post: Post) => ({
            ...post,
            showComments: false,
            isParentPost: true,
            realName: "Joe Karlsson",
            username: post.userID,
            comments: [],
            childId: 0,
            childContext: null,
            didInvalidate: false,
            updatedPostBody: post.body,
            editMode: false,
            replyMode: false,
            replyBody: "",
          }));
        } catch (error) {
          logError("PostSlice", error, {
            action: "fetchPosts.fulfilled",
            payload: action.payload,
          });
          state.posts = [];
        }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isFetchingPosts = false;
        state.didInvalidate = true;
        state.error = action.payload as string;
      });

    // Create post
    builder
      .addCase(createPost.pending, (state) => {
        state.submittingNewPost = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.submittingNewPost = false;
        state.newPostBody = "";

        const newPost = {
          ...action.payload.post,
          showComments: false,
          isParentPost: true,
          realName: action.payload.userData.name,
          username: action.payload.userData.user_id,
          comments: [],
          childId: 0,
          childContext: null,
          didInvalidate: false,
          updatedPostBody: action.payload.post.body,
          editMode: false,
          replyMode: false,
          replyBody: "",
        };

        state.posts.unshift(newPost);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.submittingNewPost = false;
        state.didInvalidate = true;
        state.error = action.payload as string;
      });

    // Update post
    builder.addCase(updatePost.fulfilled, (state, action) => {
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) {
        state.posts[index].body = action.payload.body;
        state.posts[index].editMode = false;
      }
    });

    // Delete post
    builder
      .addCase(deletePost.pending, (state) => {
        state.isDestroyingPost = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isDestroyingPost = false;
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isDestroyingPost = false;
        state.didInvalidate = true;
        state.error = action.payload as string;
      });

    // Fetch comments
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isFetchingComments = true;
        state.didInvalidate = false;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isFetchingComments = false;
        state.didInvalidate = false;

        const postIndex = state.posts.findIndex(
          (post) => post.id === action.payload.postId
        );
        if (postIndex !== -1) {
          const post = state.posts[postIndex];
          post.comments = action.payload.comments.map((comment: Comment) => ({
            ...comment,
            childId: 0,
            showComments: false,
            isParentPost: false,
          }));
          post.showComments = true;
          post.childContext =
            action.payload.comments.length > 0
              ? action.payload.comments[0]
              : null;
        }
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isFetchingComments = false;
        state.didInvalidate = true;
        state.error = action.payload as string;
      });

    // Create reply
    builder
      .addCase(createReply.pending, (state) => {
        state.isSubmittingReply = true;
        state.didInvalidate = false;
        state.error = null;
      })
      .addCase(createReply.fulfilled, (state, action) => {
        state.isSubmittingReply = false;

        const postIndex = state.posts.findIndex(
          (post) => post.id === action.payload.postId
        );
        if (postIndex !== -1) {
          const post = state.posts[postIndex];
          post.commentCount = (post.commentCount || 0) + 1;
          post.replyBody = "";
          post.comments = [action.payload.comment, ...(post.comments || [])];
          post.replyMode = false;
        }
      })
      .addCase(createReply.rejected, (state, action) => {
        state.isSubmittingReply = false;
        state.didInvalidate = true;
        state.error = action.payload as string;
      });
  },
});

export const {
  setNewPostBody,
  toggleEditMode,
  updatePostBody,
  toggleComment,
  toggleShowComment,
  toggleReplyMode,
  updateReplyBody,
  clearError,
} = postSlice.actions;

export default postSlice.reducer;
