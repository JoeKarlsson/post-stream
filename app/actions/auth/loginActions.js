export const onUsernameChange = (username) => {
  return {
    type: 'HANDLE_USERNAME_CHANGE',
    username,
  }
};

export const onPasswordChange = (password) => {
  return {
    type: 'HANDLE_PASSWORD_CHANGE',
    password,
  }
};

const requestLogin = () => {
  return {
    type: "REQUEST_LOGIN",
  }
};

const receiveLogin = (json) => {
  return {
    type: "RECEIVE_LOGIN",
    success: json.success,
    user: json,
    receivedAt: Date.now()
  }
};

export const fetchLogin = () => {
  return (dispatch, getState) => {
    const state = getState();
    const username = state.rootReducer.authReducer.get('username');
    const password = state.rootReducer.authReducer.get('password');

    dispatch(requestLogin());
    let myHeaders = new Headers();
    myHeaders.append(
      "Content-Type", 'application/x-www-form-urlencoded'
    );
    return fetch(`/api/login`, {
      method: 'POST',
      headers: myHeaders,
      body: `username=${username}&password=${password}`
    })
    .then(response => response.json())
    .then(json => dispatch(receiveLogin(json)));
  }
};
