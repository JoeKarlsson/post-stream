const requestComments = () => {
  return {
    type: "REQUEST_COMMENTS",
  }
};

const receiveComments = (comments, postId) => {
  return {
    type: "RECEIVE_COMMENTS",
    comments,
    postId,
  }
};

const fetchComments = (postId) => {
  return dispatch => {
    dispatch(requestComments());
    return fetch(`/post/${postId}/comments`)
    .then(response => response.json())
    .then(json => dispatch(receiveComments(json, postId)));
  }
};

export const invalidateComments = () => {
  return {
    type: "INVALIDATE_COMMENTS",
  }
};

const shouldFetchComments = (state, postId) => {
  const comments = state.postReducer.get('posts').get(postId).comments;
  if (comments.length === 0) {
    return true;
  } else if (comments.isFetching) {
    return false;
  } else {
    return comments.didInvalidate;
  }
};

export const fetchCommentsIfNeeded = (postId) => {
  return (dispatch, getState) => {
    if (shouldFetchComments(getState(), postId)) {
      return dispatch(fetchComments(postId));
    }
  }
};

export const handleNextComment = (postId, newChildId) => {
  return {
    type: "HANDLE_NEXT_COMMENT",
    postId,
    newChildId,
  }
}

export const handlePrevComment = (postId, newChildId) => {
  return {
    type: "HANDLE_PREV_COMMENT",
    postId,
    newChildId,
  }
}