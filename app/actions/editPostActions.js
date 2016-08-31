export const handleUpdatedPostBodyChange = (body, index) => {
  return {
    type: 'HANDLE_UPDATED_POST_BODY_CHANGE',
    body,
    index,
  }
};

export const requestUpdatedPost = (index) => {
  return {
    type: 'REQUEST_UPDATED_POST',
    index,
  }
};

export const toggleEditMode = (index, editState) => {
  return {
    type: 'TOGGLE_EDIT_MODE',
    index,
    editState,
  }
};

const receiveUpdatedPost = (json, index) => {
  console.log('index: ', index);
  return {
    type: 'RECEIVE_UPDATED_POST',
    updatedPost: json,
    index,
  }
};

export const submitUpdatedPost = (body, postId, index) => {
  return dispatch => {
    dispatch(requestUpdatedPost(index));
    let myHeaders = new Headers();
    myHeaders.append(
      'Content-Type', 'application/x-www-form-urlencoded'
    );
    return fetch(`/post/${postId}/edit`, {
      method: 'PUT',
      headers: myHeaders,
      body: `body=${body}`
    })
    .then(response => response.json())
    .then(json => dispatch(receiveUpdatedPost(json, index)));
  }
};
