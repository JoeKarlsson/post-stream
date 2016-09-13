const requestUser = () => {
  return {
    type: 'REQUEST_USER',
  }
};

const receiveUser= (userData, postId, index) => {
  return {
    type: 'RECEIVE_USER',
    userData
  }
};

const fetchUser= (userName) => {
  return dispatch => {
    dispatch(requestComments());
    return fetch(`/api/user/${userName}`)
    .then(response => response.json())
    .then(userData => dispatch(receiveUser(userData)));
  }
};
