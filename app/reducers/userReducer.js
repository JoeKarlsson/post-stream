import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE
} from '../actions/user/userActions';

import Immutable, { Map, List} from 'immutable';

const initialState = Map({
  profile: Map(),
  isFetchingPosts: false,
  isFetching: false,
  didInvalidate: false,
  posts: List(),
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

    default:
      return state
  }
}

export default user;
