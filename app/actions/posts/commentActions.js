const requestComments = () => {
  return {
    type: 'REQUEST_COMMENTS',
  }
};

const receiveComments = (comments, postId, index) => {
  return {
    type: 'RECEIVE_COMMENTS',
    comments,
    postId,
    index,
  }
};

const fetchComments = (postId, index) => {
  return dispatch => {
    dispatch(requestComments());
    return fetch(`/post/${postId}/comments`)
    .then(response => response.json())
    .then(json => dispatch(receiveComments(json, postId, index)));
  }
};

export const invalidateComments = () => {
  return {
    type: 'INVALIDATE_COMMENTS',
  }
};

const shouldFetchComments = (state, postId) => {
  const comments = state.rootReducer.postReducer
    .get('posts')
    .get(postId)
    .get('comments').toJS();

  if (comments.length === 0) {
    return true;
  } else if (comments.isFetching) {
    return false;
  } else {
    return comments.didInvalidate;
  }
};

export const fetchCommentsIfNeeded = (postId, index) => {
  return (dispatch, getState) => {
    if (shouldFetchComments(getState(), postId)) {
      return dispatch(fetchComments(postId, index));
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