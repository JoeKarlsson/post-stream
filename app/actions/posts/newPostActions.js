export const handleNewPostBodyChange = (body) => {
  return {
    type: "HANDLE_NEW_POST_BODY_CHANGE",
    body: body
  }
};

export const requestNewPost = () => {
  return {
    type: "REQUEST_NEW_POSTS",
  }
};

const receiveNewPost = (json) => {
  return {
    type: "RECEIVE_NEW_POST",
    newPost: json,
  }
};

export const submitNewPost = (body) => {
  return dispatch => {
    dispatch(requestNewPost());
    let myHeaders = new Headers();
    myHeaders.append(
      "Content-Type", 'application/x-www-form-urlencoded'
    );
    return fetch(`/post/new`, {
      method: 'POST',
      headers: myHeaders,
      body: `body=${body}`
    })
    .then(response => response.json())
    .then(json => dispatch(receiveNewPost(json)));
  }
};
