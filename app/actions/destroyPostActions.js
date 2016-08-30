const destroyPost = (postId) => {
  return {
    type: "DESTROY_POST",
    postId: postId,
  }
};

const confirmPostDestroyed = (json, postId) => {
  return {
    type: "CONFIRMED_POST_DESTROYED",
    confirmation: json,
    postId: postId,
  }
};

const fetchDestroyPost = (postId) => {
  return dispatch => {
    dispatch(destroyPost(postId));
    return fetch(`/post/${postId+1}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(json => dispatch(confirmPostDestroyed(json, postId)));
  }
};

const shouldDestroyPosts = (state, postId) => {
  const post = state.postReducer.get('posts').get(postId);
  if (post) {
    return true;
  } else if (post.isDestroyingPost) {
    return false;
  } else {
    return post.didInvalidate;
  }
};

export const destroyPostsIfNeeded = (postId) => {
  return (dispatch, getState) => {
    if (shouldDestroyPosts(getState(), postId)) {
      return dispatch(fetchDestroyPost(postId));
    }
  }
};