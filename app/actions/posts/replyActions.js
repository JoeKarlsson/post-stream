export const onToggleReplyMode = (index) => {
  return {
    type: 'TOGGLE_REPLY_MODE',
    index,
  }
};

export const handleReplyBodyChange = (body, index) => {
  return {
    type: 'HANDLE_REPLY_BODY_CHANGE',
    index,
    body,
  }
};


const requestNewReply = () => {
  return {
    type: 'REQUEST_NEW_REPLY',
  }
};

const receiveNewReply = (json) => {
  return {
    type: 'RECEIVE_NEW_REPLY',
    reply: json,
  }
};

// TODO - TEST THIS
export const submitNewReply = (body, index, postId, commentId) => {
  return dispatch => {
    dispatch(requestNewReply());
    let myHeaders = new Headers();
    myHeaders.append(
      'Content-Type', 'application/x-www-form-urlencoded'
    );
    return fetch(`/post/${index}/comments/${commentId}/new`, {
      method: 'POST',
      headers: myHeaders,
      body: `body=${body}`
    })
    .then(response => response.json())
    .then(json => dispatch(receiveNewReply(json)));
  }
};