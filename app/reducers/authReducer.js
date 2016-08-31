import { Map } from 'immutable';

function authReducer(state = Map(), action) {
  switch (action.type) {
    case 'HANDLE_LOGIN_USERNAME_CHANGE':
      return state;

    default:
      return state
  }
}

export default authReducer;
