const requestPosts = () => {
  return {
    type: "REQUEST_POSTS",
  }
}

const receivePosts = (json) => {
  return {
    type: "RECEIVE_POSTS",
    posts: json,
    receivedAt: Date.now()
  }
}

const fetchPosts = () => {
  return dispatch => {
    dispatch(requestPosts())
    return fetch(`/post`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(json)))
  }
}

export const invalidatePosts = () => {
  return {
    type: "INVALIDATE_POSTS",
  }
}

const shouldFetchPosts = (state) => {
  const posts = state.postReducer.posts
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

export const fetchPostsIfNeeded = () => {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState())) {
      return dispatch(fetchPosts())
    }
  }
}
