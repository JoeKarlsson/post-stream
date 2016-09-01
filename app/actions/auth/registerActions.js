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
    user: json,
    receivedAt: Date.now()
  }
};

export const fetchRegisterUser = () => {
  return (dispatch, getState) => {
    const state = getState();
    const username = state.rootReducer.authReducer.get('username');
    const password = state.rootReducer.authReducer.get('password');
    const first_name = state.rootReducer.authReducer.get('first_name');
    const last_name = state.rootReducer.authReducer.get('last_name');
    const bio = state.rootReducer.authReducer.get('bio');

    dispatch(requestRegisterUser());
    let myHeaders = new Headers();
    myHeaders.append(
      "Content-Type", 'application/x-www-form-urlencoded'
    );
    return fetch(`/api/register`, {
      method: 'POST',
      headers: myHeaders,
      body: `username=${username}&password=${password}&first_name=${first_name}&last_name=${last_name}&bio=${bio}`
    })
    .then(response => response.json())
    .then(json => dispatch(receiveRegisterUser(json)));
  }
};