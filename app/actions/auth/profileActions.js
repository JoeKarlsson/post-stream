const requestUser = () => {
  return {
    type: 'REQUEST_USER',
  }
};

const receiveUser= (userData) => {
  return {
    type: 'RECEIVE_USER',
    userData
  }
};

export const fetchUserData = (userName) => {
  return dispatch => {
    dispatch(requestUser());
    return fetch(`/post/user/${userName}`)
    .then(response => response.json())
    .then(userData => dispatch(receiveUser(userData)));
  }
};
