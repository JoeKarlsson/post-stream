import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";
import { isTokenExpired } from "../components/shared/auth/jwtHelper";
import { readJsonOrThrow } from "./http";
import { updateProfile } from "./profileSlice";

interface AuthResponse {
  token: string;
  user: User;
}

const storeSession = ({ token, user }: AuthResponse) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const postAuth = async (path: string, body: object): Promise<AuthResponse> => {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await readJsonOrThrow(response);
  storeSession(data);
  return data;
};

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await postAuth("/auth/login", credentials);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    newUser: {
      email: string;
      password: string;
      username: string;
      first_name: string;
      last_name: string;
      bio: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await postAuth("/auth/register", newUser);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

interface UserState {
  profile: User | null;
  isFetching: boolean;
  isAuthenticated: boolean;
  errorMessage: string;
  errorCode: string | null;
}

// Restore a session from a previous visit, unless the token has expired
const loadSession = (): User | null => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (token && user && !isTokenExpired(token)) {
    return user;
  }
  clearSession();
  return null;
};

const savedUser = loadSession();

const initialState: UserState = {
  profile: savedUser,
  isFetching: false,
  isAuthenticated: savedUser !== null,
  errorMessage: "",
  errorCode: null,
};

const authPending = (state: UserState) => {
  state.isFetching = true;
  state.errorMessage = "";
  state.errorCode = null;
};

const authFulfilled = (state: UserState, action: PayloadAction<AuthResponse>) => {
  state.isFetching = false;
  state.isAuthenticated = true;
  state.profile = action.payload.user;
};

const authRejected = (code: string) => (state: UserState, action: { payload: unknown }) => {
  state.isFetching = false;
  state.isAuthenticated = false;
  state.errorMessage = action.payload as string;
  state.errorCode = code;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      clearSession();
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
    builder
      .addCase(loginUser.pending, authPending)
      .addCase(loginUser.fulfilled, authFulfilled)
      .addCase(loginUser.rejected, authRejected("LOGIN_FAILED"))
      .addCase(registerUser.pending, authPending)
      .addCase(registerUser.fulfilled, authFulfilled)
      .addCase(registerUser.rejected, authRejected("REGISTER_FAILED"))
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      });
  },
});

export const { logout, clearError } = userSlice.actions;

export default userSlice.reducer;
