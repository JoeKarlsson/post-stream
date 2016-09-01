export const onRegistrationFormChange = (fieldName, content) => {
  return {
    type: 'HANDLE_REGISTRATION_FORM_CHANGE',
    fieldName,
    content,
  }
};

const requestRegisterUser = () => {
  return {
    type: "REQUEST_REGISTER_USER",
  }
};

const receiveRegisterUser = (json) => {
  return {
    type: "RECEIVE_REGISTER_USER",
    success: json.success,
    user: json,
    receivedAt: Date.now()
  }
};

export const fetchRegisterUser = () => {
  return (dispatch, getState) => {
    const state = getState();
    const username = state.rootReducer.authReducer.get('username');
    const password = state.rootReducer.authReducer.get('password');
    dispatch(requestRegisterUser());
    let myHeaders = new Headers();
    myHeaders.append(
      "Content-Type", 'application/x-www-form-urlencoded'
    );
    return fetch(`/api/register`, {
      method: 'POST',
      headers: myHeaders,
      body: `username=${username}&password=${password}`
    })
    .then(response => response.json())
    .then(json => dispatch(receiveRegisterUser(json)));
  }
};