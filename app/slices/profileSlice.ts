import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PublicProfile, User } from "../types";
import { authJsonHeaders, readJsonOrThrow } from "./http";

// The profile page's user, as anyone can see it (no email)
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/auth/user/${encodeURIComponent(username)}`);
      const data = await readJsonOrThrow(response);
      return data.user as PublicProfile;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const setFollowing = createAsyncThunk(
  "profile/setFollowing",
  async (
    {
      username,
      follow,
    }: { username: string; follow: boolean; myUsername: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `/auth/user/${encodeURIComponent(username)}/follow`,
        { method: follow ? "POST" : "DELETE", headers: authJsonHeaders() }
      );
      await readJsonOrThrow(response);
      return { follow };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Edits the logged-in user's own profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (
    fields: { first_name: string; last_name: string; bio: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/auth/profile", {
        method: "PUT",
        headers: authJsonHeaders(),
        body: JSON.stringify(fields),
      });
      const data = await readJsonOrThrow(response);
      return data.user as User;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

interface ProfileState {
  profile: PublicProfile | null;
  isFetching: boolean;
  isSaving: boolean;
  errorMessage: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isFetching: false,
  isSaving: false,
  errorMessage: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isFetching = true;
        state.errorMessage = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isFetching = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isFetching = false;
        state.profile = null;
        state.errorMessage = action.payload as string;
      });

    builder
      .addCase(setFollowing.fulfilled, (state, action) => {
        const me = action.meta.arg.myUsername;
        if (!state.profile) return;
        state.profile.followers = action.payload.follow
          ? [...state.profile.followers, me]
          : state.profile.followers.filter((name) => name !== me);
      })
      .addCase(setFollowing.rejected, (state, action) => {
        state.errorMessage = action.payload as string;
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.isSaving = true;
        state.errorMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isSaving = false;
        if (state.profile?.username === action.payload.username) {
          const { first_name, last_name, bio } = action.payload;
          Object.assign(state.profile, { first_name, last_name, bio });
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isSaving = false;
        state.errorMessage = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
