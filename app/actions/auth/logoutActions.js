const requestLogout = () => {
  return {
    type: 'REQUEST_LOGOUT',
  }
};

const receiveLogout = (json) => {

  return {
    type: 'RECEIVE_LOGOUT',
    success: json.success,
  }
};

export const fetchLogout = () => {

  return dispatch => {
    dispatch(requestLogout());
    return fetch(`/api/logout`)
    .then(response => response.json())
    .then(json => dispatch(receiveLogout(json)));
  }
};
