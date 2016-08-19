export const handleNewPostBodyChange = (body) => {
  return {
    type: "HANDLE_NEW_POST_BODY_CHANGE",
    body: body
  }
}

export const requestNewPost = () => {
  return {
    type: "REQUEST_NEW_POSTS",
  }
}

const receiveNewPost = (json) => {
  return {
    type: "RECEIVE_NEW_POST",
    newPost: json,
  }
}

export const submitNewPost = (body) => {
  return dispatch => {
    dispatch(requestNewPost())
    return fetch(`/post/new`, {
      method: 'POST',
      body: `body=${body}`
    })
      .then(response => response.json())
      .then(json => dispatch(receiveNewPost(json)))
  }
}
