import {
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
  PROFILE_FAILURE
} from '../actions/profile/profileActions';
import {
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE
} from '../actions/profile/updateProfileActions';
import Immutable, { Map, List} from 'immutable';

const profileToken = JSON.parse(localStorage.getItem('profile'));
console.log('profileToken: ', profileToken);
const initialState = Map({
  profile: Immutable.fromJS(profileToken),
  isFetchingPosts: false,
  didInvalidate: false,
  posts: List(),
});

function profile(state = initialState, action) {
  switch (action.type) {
    case PROFILE_FAILURE:
      return state.set('didInvalidate', true);

    case PROFILE_REQUEST:
      return state.set('isFetchingPosts', true)
        .set('didInvalidate', false);

    case PROFILE_SUCCESS:
      return state.updateIn(['posts'], (posts) => {
        const parsedPosts = JSON.parse(action.response);
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
        return profile.updateIn(['user_metadata'], (metadata) =>{
          return metadata.set(action.fieldName, action.content);
        })
      });

    case UPDATE_PROFILE_REQUEST:
      return state;

    case UPDATE_PROFILE_SUCCESS:
      return state;

    case UPDATE_PROFILE_FAILURE:
      return state;

    default:
      return state
    }
}

export default profile;
