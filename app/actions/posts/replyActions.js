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

const receiveNewReply = (json, index) => {
  return {
    type: 'RECEIVE_NEW_REPLY',
    reply: json,
    index,
  }
};

export const submitNewReply = (data) => {
  return dispatch => {
    dispatch(requestNewReply());
    let myHeaders = new Headers();
    myHeaders.append(
      'Content-Type', 'application/x-www-form-urlencoded'
    );
    return fetch(`/post/${data.id}/comments/${data.commentId}/new`, {
      method: 'POST',
      headers: myHeaders,
      body: `body=${data.replyBody}&userID=${data.userID}`
    })
    .then(response => response.json())
    .then(json => dispatch(receiveNewReply(json, data.index)));
  }
};