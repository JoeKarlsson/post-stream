import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

// Async thunks for API calls
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user");
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

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      const data = await response.json();

      // Store token and user data
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    userData: {
      email: string;
      password: string;
      nickname: string;
      name?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      const data = await response.json();

      // Store token and user data
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const getProfile = createAsyncThunk(
  "user/getProfile",
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

interface UserState {
  profile: User | null;
  isFetchingPosts: boolean;
  isFetching: boolean;
  didInvalidate: boolean;
  posts: any[];
  isAuthenticated: boolean;
  errorMessage: string;
  errorCode: string | null;
}

// Check if there's a valid token on initialization
const token = localStorage.getItem("token");
const userToken = JSON.parse(localStorage.getItem("user") || "null");
const isTokenValid = !!token && !!userToken;

const initialState: UserState = {
  profile: userToken,
  isFetchingPosts: false,
  isFetching: false,
  didInvalidate: false,
  posts: [],
  isAuthenticated: isTokenValid,
  errorMessage: "",
  errorCode: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Reset state
      state.isAuthenticated = false;
      state.profile = null;
      state.errorMessage = "";
      state.errorCode = null;
    },
    clearError: (state) => {
      state.errorMessage = "";
      state.errorCode = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isAuthenticated = true;
        state.errorMessage = "";
        state.errorCode = null;
        state.profile = action.payload.user;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isFetching = false;
        state.isAuthenticated = false;
      });

    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.isFetching = true;
        state.errorMessage = "";
        state.errorCode = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isAuthenticated = true;
        state.errorMessage = "";
        state.errorCode = null;
        state.profile = action.payload.user || action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isFetching = false;
        state.isAuthenticated = false;
        state.errorMessage = action.payload as string;
        state.errorCode = "LOGIN_FAILED";
      });

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.isFetching = true;
        state.errorMessage = "";
        state.errorCode = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isAuthenticated = true;
        state.errorMessage = "";
        state.errorCode = null;
        state.profile = action.payload.user || action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isFetching = false;
        state.isAuthenticated = false;
        state.errorMessage = action.payload as string;
        state.errorCode = "REGISTER_FAILED";
      });

    // Get profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.isFetching = true;
        state.errorMessage = "";
        state.errorCode = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isAuthenticated = true;
        state.errorMessage = "";
        state.errorCode = null;
        state.profile = action.payload.user || action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isFetching = false;
        state.isAuthenticated = false;
        state.errorMessage = action.payload as string;
        state.errorCode = "PROFILE_FAILED";
      });
  },
});

export const { logout, clearError } = userSlice.actions;

export default userSlice.reducer;
