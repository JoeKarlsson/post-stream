const destroyPost = (postId) => {
  return {
    type: 'DESTROY_POST',
    postId,
  }
};

const confirmPostDestroyed = (json, postId, index) => {
  return {
    type: 'CONFIRMED_POST_DESTROYED',
    confirmation: json,
    postId,
    index,
  }
};

const fetchDestroyPost = (postId, index) => {
  return dispatch => {
    dispatch(destroyPost(postId));
    return fetch(`/post/${postId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(json => dispatch(confirmPostDestroyed(json, postId, index)));
  }
};

const shouldDestroyPosts = (state, postId, index) => {
  const post = state.rootReducer.postReducer.get('posts').get(index);
  if (post) {
    return true;
  } else if (post.isDestroyingPost) {
    return false;
  } else {
    return post.didInvalidate;
  }
};

export const destroyPostsIfNeeded = (postId, index) => {
  return (dispatch, getState) => {
    if (shouldDestroyPosts(getState(), postId, index)) {
      return dispatch(fetchDestroyPost(postId, index));
    }
  }
};