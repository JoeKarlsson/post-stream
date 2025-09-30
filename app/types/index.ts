import { Map, List } from "immutable";

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
  username?: string;
  comments?: Comment[];
  childId?: number;
  childContext?: any;
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

// Redux State Types
export interface PostState {
  isFetchingPosts: boolean;
  isFetchingComments: boolean;
  isDestroyingPost: boolean;
  submittingNewPost: boolean;
  isSubmittingReply: boolean;
  didInvalidate: boolean;
  lastUpdated: number | null;
  newPostBody: string;
  receivedAt: number | null;
  posts: List<Map<string, any>>;
}

export interface UserState {
  profile: Map<string, any>;
  isFetchingPosts: boolean;
  isFetching: boolean;
  didInvalidate: boolean;
  posts: List<Map<string, any>>;
  isAuthenticated: boolean;
  errorMessage: string;
  errorCode: string | null;
}

export interface ProfileState {
  profile: Map<string, any>;
  isFetchingPosts: boolean;
  didInvalidate: boolean;
  posts: List<Map<string, any>>;
  isFetching: boolean;
  isAuthenticated: boolean;
  errorMessage?: string;
  errorCode?: string;
}

export interface RootState {
  post: PostState;
  user: UserState;
  profile: ProfileState;
}

// Action Types
export interface BaseAction {
  type: string;
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
  response: any;
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
export interface ApiResponse<T = any> {
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
