import { Map } from 'immutable';

const initialState = Map({
  username: '',
  password: '',
  isFetchingLogin: false,
  didInvalidateLogin: false,
  lastUpdated: null,
  receivedAt: null,
});

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'HANDLE_USERNAME_CHANGE':
      return state.set('username', action.username);

    case 'HANDLE_PASSWORD_CHANGE':
      return state.set('password', action.password);

    case 'REQUEST_LOGIN':
      return state;

    case 'RECEIVE_LOGIN':
      return state;

    default:
      return state
  }
}

export default authReducer;
