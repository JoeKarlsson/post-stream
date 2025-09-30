import {
  LOGIN_SUCCESS,
  REGISTER_SUCCESS
} from '../actions/auth/localAuthActions'
import {
  LOGOUT_SUCCESS
} from '../actions/auth/logoutActions'
import { isTokenExpired } from '../components/shared/auth/jwtHelper'; import {
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
  PROFILE_FAILURE
} from '../actions/profile/profileActions';
import {
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE
} from '../actions/profile/updateProfileActions';
import { Map, List, fromJS } from 'immutable';

// Checks if there is a saved token and it's still valid
const token = localStorage.getItem('token');
const isTokenValid = !!token && !isTokenExpired(token);

let userToken = JSON.parse(localStorage.getItem('user')) || {};

const initialState = Map({
  profile: fromJS(userToken),
  isFetchingPosts: false,
  didInvalidate: false,
  posts: List(),
  isFetching: false,
  isAuthenticated: isTokenValid,
});

function profile(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS: {
      let userToken = JSON.parse(localStorage.getItem('user'));
      return state.set('isFetching', false)
        .set('isAuthenticated', true)
        .set('errorMessage', '')
        .set('profile', fromJS(userToken))
    }

    case LOGOUT_SUCCESS:
      return state.set('isFetching', true)
        .set('isAuthenticated', false)

    case PROFILE_FAILURE:
      return state.set('didInvalidate', true);

    case PROFILE_REQUEST:
      return state.set('isFetchingPosts', true)
        .set('didInvalidate', false);

    case PROFILE_SUCCESS:
      return state.updateIn(['posts'], (posts) => {
        const parsedPosts = typeof action.response === 'string' ? JSON.parse(action.response) : action.response;
        return posts.clear().concat(
          parsedPosts.map((post) => {
            return Map(post)
              .set('showComments', false)
              .set('isParentPost', true)
              .set('realName', post.nickname)
              .set('username', post.userID)
              .set('comments', List())
              .set('childId', 0)
              .set('childContext', {})
              .set('didInvalidate', false)
              .set('updatedPostBody', post.body)
              .set('editMode', false)
              .set('replyMode', false)
              .set('replyBody', '')
          })
        )
      })
        .set('isFetchingPosts', false)
        .set('didInvalidate', false)
        .set('lastUpdated', Date.now());

    case 'HANDLE_FORM_CHANGE':
      return state.updateIn(['profile'], (profile) => {
        return profile.updateIn(['user_metadata'], (metadata) => {
          return metadata.set(action.fieldName, action.content);
        })
      });

    case UPDATE_PROFILE_REQUEST:
      return state;

    case UPDATE_PROFILE_SUCCESS: {
      const parsedProfile = typeof action.response === 'string' ? JSON.parse(action.response) : action.response;
      return state.set('profile', fromJS(parsedProfile));
    }

    case UPDATE_PROFILE_FAILURE:
      return state;

    default:
      return state
  }
}

export default profile;
