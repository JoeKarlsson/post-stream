import {
  PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE
} from '../actions/profile/profileActions';
import { Map, List } from 'immutable';

const initialState = Map({
  isFetchingPosts: false,
  didInvalidate: false,
  posts: List()
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
            .set('realName', `Joe Karlsson`)
            .set('username', 'JoeJoeBinks131')
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

    default:
      return state
    }
}

export default profile;
