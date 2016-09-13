import { Map, List } from 'immutable';

const initialState = Map({
  username: '',
  password: '',
  id: 0,
  first_name: '',
  last_name: '',
  bio: '',
  following: List(),
  posts: List(),
  createdAt: null,
  isFetchingLogin: false,
  didInvalidateLogin: false,
  lastUpdated: null,
  receivedAt: null,
  isLoggedIn: false,
});

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'HANDLE_USERNAME_CHANGE':
      return state.set('username', action.username);

    case 'HANDLE_PASSWORD_CHANGE':
      return state.set('password', action.password);

    case 'REQUEST_LOGIN':
      return state.set('isFetchingLogin', true);

    case 'RECEIVE_LOGIN':
      return state.set('isLoggedIn', action.success)
        .set('id', action.user.id)
        .set('first_name', action.user.first_name)
        .set('last_name', action.user.last_name)
        .set('bio', action.user.bio)
        .set('following', state.get('following').concat(action.user.following))
        .set('createdAt', action.user.createdAt)
        .set('bio', action.user.bio)
        .set('id', action.user.id)
        .set('receivedAt', action.receivedAt)
        .set('password', '')
        .set('isFetchingLogin', false);

    case 'HANDLE_REGISTRATION_FORM_CHANGE':
      return state.set(action.fieldName, action.content);

    case 'REQUEST_REGISTER_USER':
      return state;

    case 'RECEIVE_REGISTER_USER':
      return state.set('isLoggedIn', true)
        .set('id', action.user.id)
        .set('first_name', action.user.first_name)
        .set('last_name', action.user.last_name)
        .set('bio', action.user.bio)
        .set('following', state.get('following').concat(action.user.following))
        .set('createdAt', action.user.createdAt)
        .set('bio', action.user.bio)
        .set('id', action.user.id)
        .set('receivedAt', action.receivedAt)
        .set('password', '')
        .set('isFetchingLogin', false);

    case 'REQUEST_LOGOUT':
      return state;

    case 'RECEIVE_LOGOUT':
      return state.set('isLoggedIn', !action.success);

    default:
      return state
  }
}

export default authReducer;
