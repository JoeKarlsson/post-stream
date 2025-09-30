import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, Post } from "../types";
import { isTokenExpired } from "../components/shared/auth/jwtHelper";

// Async thunks for API calls
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
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

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (
    profileData: {
      name?: string;
      bio?: string;
      location?: string;
      website?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams(profileData).toString(),
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
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

interface ProfileState {
  profile: User | null;
  isFetchingPosts: boolean;
  didInvalidate: boolean;
  posts: Post[];
  isFetching: boolean;
  isAuthenticated: boolean;
  errorMessage?: string;
  errorCode?: string;
}

// Check if there's a valid token on initialization
const token = localStorage.getItem("token");
const isTokenValid = !!token && !isTokenExpired(token);
const userToken = JSON.parse(localStorage.getItem("user") || "null");

const initialState: ProfileState = {
  profile: userToken,
  isFetchingPosts: false,
  didInvalidate: false,
  posts: [],
  isFetching: false,
  isAuthenticated: isTokenValid,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    handleFormChange: (
      state,
      action: PayloadAction<{ fieldName: string; content: string }>
    ) => {
      if (state.profile && state.profile.user_metadata) {
        state.profile.user_metadata = {
          ...state.profile.user_metadata,
          [action.payload.fieldName]: action.payload.content,
        };
      }
    },
    clearError: (state) => {
      state.errorMessage = undefined;
      state.errorCode = undefined;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isFetchingPosts = true;
        state.didInvalidate = false;
        state.errorMessage = undefined;
        state.errorCode = undefined;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isFetchingPosts = false;
        state.didInvalidate = false;

        try {
          const parsedPosts = Array.isArray(action.payload)
            ? action.payload
            : [];
          state.posts = parsedPosts.map((post: Post) => ({
            ...post,
            showComments: false,
            isParentPost: true,
            realName: post.userID,
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
          state.posts = [];
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isFetchingPosts = false;
        state.didInvalidate = true;
        state.errorMessage = action.payload as string;
        state.errorCode = "PROFILE_FETCH_FAILED";
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isFetching = true;
        state.errorMessage = undefined;
        state.errorCode = undefined;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isFetching = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isFetching = false;
        state.errorMessage = action.payload as string;
        state.errorCode = "PROFILE_UPDATE_FAILED";
      });
  },
});

export const { handleFormChange, clearError } = profileSlice.actions;

export default profileSlice.reducer;
