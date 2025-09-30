import { api } from "../../middleware/localApi";
import { ToggleCommentAction, ToggleShowCommentAction } from "../../types";

export const COMMENT_REQUEST = "COMMENT_REQUEST";
export const COMMENT_SUCCESS = "COMMENT_SUCCESS";
export const COMMENT_FAILURE = "COMMENT_FAILURE";

export const fetchCommentsIfNeeded = (postId: number, index: number) => {
  const data = {
    postId,
    index,
  };

  return {
    [api]: {
      endpoint: `/post/${postId}/comments`,
      method: "GET",
      types: [COMMENT_REQUEST, COMMENT_SUCCESS, COMMENT_FAILURE],
      authenticated: false,
      data: { index },
    },
  };
};

export const toggleComment = (
  index: number,
  newChildId: number
): ToggleCommentAction => {
  return {
    type: "TOGGLE_COMMENT",
    index,
    newChildId,
  };
};

export const toggleShowComment = (
  index: number,
  showCommentState: boolean
): ToggleShowCommentAction => {
  return {
    type: "TOGGLE_SHOW_COMMENT",
    index,
    showCommentState,
  };
};
