import { CALL_API } from "../../middleware/api";
import {
  ToggleEditModeAction,
  HandleUpdatedPostBodyChangeAction,
} from "../../types";

export const EDIT_POST_REQUEST = "EDIT_POST_REQUEST";
export const EDIT_POST_SUCCESS = "EDIT_POST_SUCCESS";
export const EDIT_POST_FAILURE = "EDIT_POST_FAILURE";
export const HANDLE_UPDATED_POST_BODY_CHANGE =
  "HANDLE_UPDATED_POST_BODY_CHANGE";

export const submitUpdatedPost = (
  body: string,
  postId: number,
  index: number
) => {
  const data = {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `body=${body}`,
    index,
  };

  return {
    [CALL_API]: {
      endpoint: `/post/${postId}/edit`,
      authenticated: true,
      types: [EDIT_POST_REQUEST, EDIT_POST_SUCCESS, EDIT_POST_FAILURE],
      data,
    },
  };
};

export const toggleEditMode = (
  index: number,
  editState: boolean
): ToggleEditModeAction => {
  return {
    type: "TOGGLE_EDIT_MODE",
    index,
    editState,
  };
};

export const handleUpdatedPostBodyChange = (
  body: string,
  index: number
): HandleUpdatedPostBodyChangeAction => {
  return {
    type: "HANDLE_UPDATED_POST_BODY_CHANGE",
    body,
    index,
  };
};
