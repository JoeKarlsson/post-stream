import { Map } from 'immutable';

const authReducer = (state = Map(), action) => {
  switch (action.type) {
    case 'HANDLE_LOGIN_USERNAME_CHANGE':
      console.log('hot: ');
      return state;

    case 'HANDLE_LOGIN':
      console.log('hot: ');
      return state;

    default:
      return state
  }
}

export default authReducer;
