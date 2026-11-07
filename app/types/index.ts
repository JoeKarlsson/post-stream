export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicProfile {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  createdAt: string;
  followers: string[];
  following: string[];
}

export interface Post {
  id: number;
  body: string;
  userID: string;
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
  // Set when the author edited the post
  editedAt?: string | null;
}

export interface Comment {
  id: number;
  body: string;
  userID: string;
  PostId: number;
  // Which contextual response (null for older free-form replies)
  kind?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  code: string;
  message: string;
  status?: number;
  timestamp?: string;
}

export interface ErrorResponse {
  error: ApiError;
}
