// Removed Immutable.js imports - using plain JavaScript objects with RTK

// User and Profile Types
export interface User {
  id: number;
  email: string;
  nickname: string;
  user_metadata?: {
    name?: string;
    bio?: string;
    location?: string;
    website?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  isAuthenticated: boolean;
  errorMessage?: string;
  errorCode?: string;
}

// Post Types
export interface Post {
  id: number;
  body: string;
  userID: number;
  createdAt: string;
  updatedAt: string;
  commentCount?: number;
  showComments?: boolean;
  isParentPost?: boolean;
  realName?: string;
  username?: string | number;
  comments?: Comment[];
  childId?: number;
  childContext?: Comment | null;
  didInvalidate?: boolean;
  updatedPostBody?: string;
  editMode?: boolean;
  replyMode?: boolean;
  replyBody?: string;
}

export interface Comment {
  id: number;
  body: string;
  userID: number;
  postID: number;
  createdAt: string;
  updatedAt: string;
  childId?: number;
  showComments?: boolean;
  isParentPost?: boolean;
}

// Redux State Types - Updated for RTK
export interface PostState {
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

export interface UserState {
  profile: User | null;
  isFetchingPosts: boolean;
  isFetching: boolean;
  didInvalidate: boolean;
  posts: Post[];
  isAuthenticated: boolean;
  errorMessage: string;
  errorCode: string | null;
}

export interface ProfileState {
  profile: User | null;
  isFetchingPosts: boolean;
  didInvalidate: boolean;
  posts: Post[];
  isFetching: boolean;
  isAuthenticated: boolean;
  errorMessage?: string;
  errorCode?: string;
}

// RootState is now exported from slices/index.ts

// Action Types
export interface BaseAction {
  type: string;
}

export interface ToggleEditModeAction extends BaseAction {
  type: "TOGGLE_EDIT_MODE";
  index: number;
  editState: boolean;
}

export interface HandleUpdatedPostBodyChangeAction extends BaseAction {
  type: "HANDLE_UPDATED_POST_BODY_CHANGE";
  index: number;
  body: string;
}

export interface ToggleCommentAction extends BaseAction {
  type: "TOGGLE_COMMENT";
  index: number;
  newChildId: number;
}

export interface ToggleShowCommentAction extends BaseAction {
  type: "TOGGLE_SHOW_COMMENT";
  index: number;
  showCommentState: boolean;
}

export interface ToggleReplyModeAction extends BaseAction {
  type: "TOGGLE_REPLY_MODE";
  index: number;
}

export interface HandleReplyBodyChangeAction extends BaseAction {
  type: "HANDLE_REPLY_BODY_CHANGE";
  index: number;
  body: string;
}

export interface HandleNewPostBodyChangeAction extends BaseAction {
  type: "HANDLE_NEW_POST_BODY_CHANGE";
  body: string;
}

export interface HandleFormChangeAction extends BaseAction {
  type: "HANDLE_FORM_CHANGE";
  fieldName: string;
  content: string;
}

export interface ApiAction extends BaseAction {
  [key: symbol]: {
    endpoint: string;
    method: string;
    body?: string;
    headers?: Record<string, string>;
    types: [string, string, string];
    authenticated?: boolean;
  };
}

export interface SuccessAction extends BaseAction {
  response: unknown;
}

export interface FailureAction extends BaseAction {
  error: string;
  errorCode?: string;
}

export interface LoginAction extends BaseAction {
  type: "LOGIN_SUCCESS" | "LOGIN_FAILURE";
  response?: { user: User; token: string };
  error?: string;
  errorCode?: string;
}

export interface RegisterAction extends BaseAction {
  type: "REGISTER_SUCCESS" | "REGISTER_FAILURE";
  response?: { user: User; token: string };
  error?: string;
  errorCode?: string;
}

export interface LogoutAction extends BaseAction {
  type: "LOGOUT_SUCCESS";
}

export interface ProfileAction extends BaseAction {
  type: "PROFILE_SUCCESS" | "PROFILE_FAILURE";
  response?: User;
  error?: string;
  errorCode?: string;
}

export interface PostAction extends BaseAction {
  type: "POST_SUCCESS" | "POST_FAILURE";
  response?: Post[];
  error?: string;
}

export interface NewPostAction extends BaseAction {
  type: "NEW_POST_SUCCESS" | "NEW_POST_FAILURE";
  response?: Post;
  data?: { name: string; user_id: number };
  error?: string;
}

export interface EditPostAction extends BaseAction {
  type: "EDIT_POST_SUCCESS" | "EDIT_POST_FAILURE";
  response?: Post;
  data?: { index: number };
  error?: string;
}

export interface DestroyPostAction extends BaseAction {
  type: "DESTROY_POST_SUCCESS" | "DESTROY_POST_FAILURE";
  data?: { index: number };
  error?: string;
}

export interface CommentAction extends BaseAction {
  type: "COMMENT_SUCCESS" | "COMMENT_FAILURE";
  response?: Comment[];
  data?: { index: number };
  error?: string;
}

export interface ReplyAction extends BaseAction {
  type: "REPLY_SUCCESS" | "REPLY_FAILURE";
  response?: Comment;
  data?: { index: number };
  error?: string;
}

// Union types for all actions
export type AppAction =
  | LoginAction
  | RegisterAction
  | LogoutAction
  | ProfileAction
  | PostAction
  | NewPostAction
  | EditPostAction
  | DestroyPostAction
  | CommentAction
  | ReplyAction
  | ToggleEditModeAction
  | HandleUpdatedPostBodyChangeAction
  | ToggleCommentAction
  | ToggleShowCommentAction
  | ToggleReplyModeAction
  | HandleReplyBodyChangeAction
  | HandleNewPostBodyChangeAction
  | HandleFormChangeAction
  | BaseAction;

// Component Props Types
export interface HeaderProps {
  isAuthenticated: boolean;
  errorMessage?: string;
  errorCode?: string;
  dispatch: (action: AppAction) => void;
  user: User;
}

export interface AppProps {
  isAuthenticated: boolean;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  nickname: string;
  name?: string;
}

export interface ProfileFormData {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
}

// Middleware Types
export interface ApiCallConfig {
  endpoint: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
  types: [string, string, string];
  authenticated?: boolean;
}

export interface ApiMiddlewareAction {
  [key: symbol]: ApiCallConfig;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  status?: number;
  timestamp?: string;
}

export interface ErrorResponse {
  error: ApiError;
}
