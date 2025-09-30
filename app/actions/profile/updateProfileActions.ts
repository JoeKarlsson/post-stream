import { api } from "../../middleware/localApi";
import { User, ApiMiddlewareAction } from "../../types";

export const UPDATE_PROFILE_REQUEST = "UPDATE_PROFILE_REQUEST";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILURE = "UPDATE_PROFILE_FAILURE";

export const updateProfile = (
  profileData: Partial<User>
): ApiMiddlewareAction => {
  return {
    [api]: {
      endpoint: "/auth/profile",
      method: "PUT",
      body: JSON.stringify(profileData),
      headers: { "Content-Type": "application/json" },
      types: [
        UPDATE_PROFILE_REQUEST,
        UPDATE_PROFILE_SUCCESS,
        UPDATE_PROFILE_FAILURE,
      ],
      authenticated: true,
    },
  };
};

export const onFormChange = (fieldName: string, content: string) => {
  return {
    type: "HANDLE_FORM_CHANGE",
    fieldName,
    content,
  };
};

export const followUser = (
  profile: User,
  metadata: { user_metadata: any }
): ApiMiddlewareAction => {
  return {
    [api]: {
      endpoint: "/auth/profile",
      method: "PUT",
      body: JSON.stringify(metadata),
      headers: { "Content-Type": "application/json" },
      types: [
        UPDATE_PROFILE_REQUEST,
        UPDATE_PROFILE_SUCCESS,
        UPDATE_PROFILE_FAILURE,
      ],
      authenticated: true,
    },
  };
};
