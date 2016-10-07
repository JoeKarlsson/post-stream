import { CALL_API } from '../../middleware/api';

export const COMMENT_REQUEST = 'COMMENT_REQUEST';
export const COMMENT_SUCCESS = 'COMMENT_SUCCESS';
export const COMMENT_FAILURE = 'COMMENT_FAILURE';

export const fetchCommentsIfNeeded = (postId, index) => {
  const data = {
    postId,
    index,
  };

  return {
    [CALL_API]: {
      endpoint: `/post/${postId}/comments`,
      types: [COMMENT_REQUEST, COMMENT_SUCCESS, COMMENT_FAILURE],
      data,
    }
  }
};

export const toggleComment = (index, newChildId) => {
  return {
    type: 'TOGGLE_COMMENT',
    index,
    newChildId,
  }
};

export const toggleShowComment = (index, showCommentState) => {
  return {
    type: 'TOGGLE_SHOW_COMMENT',
    index,
    showCommentState,
  }
};
