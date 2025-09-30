import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE
} from '../actions/user/userActions';

import { 
  LOGIN_SUCCESS, 
  LOGIN_FAILURE, 
  REGISTER_SUCCESS, 
  REGISTER_FAILURE,
  PROFILE_SUCCESS,
  PROFILE_FAILURE
} from '../actions/auth/localAuthActions';
import { LOGOUT_SUCCESS } from '../actions/auth/logoutActions';

import Immutable, { Map, List} from 'immutable';

const initialState = Map({
  profile: Map(),
  isFetchingPosts: false,
  isFetching: false,
  didInvalidate: false,
  posts: List(),
  isAuthenticated: false,
  errorMessage: ''
});

function user(state = initialState, action) {
  switch (action.type) {

    case GET_USER_REQUEST:
      return state;

    case GET_USER_SUCCESS:
    const parsedProfile = JSON.parse(action.response);
      return state.set('isFetching', false)
        .set('isAuthenticated', true)
        .set('errorMessage', '')
        .set('profile', Immutable.fromJS(parsedProfile))

    case GET_USER_FAILURE:
      return state;

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case PROFILE_SUCCESS:
      return state.set('isFetching', false)
        .set('isAuthenticated', true)
        .set('errorMessage', '')
        .set('profile', Immutable.fromJS(action.response.user || action.response))

    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case PROFILE_FAILURE:
      return state.set('isFetching', false)
        .set('isAuthenticated', false)
        .set('errorMessage', action.error)

    case LOGOUT_SUCCESS:
      return state.set('isAuthenticated', false)
        .set('profile', Map())
        .set('errorMessage', '')

    default:
      return state
  }
}

export default user;
