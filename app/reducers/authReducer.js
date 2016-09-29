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

    case 'REQUEST_USER':
      return state;

    case 'RECEIVE_USER':
      return state.updateIn(['posts'], (posts) => {
        return posts.clear().concat(
          action.userData.map((post) => {
            return Map(post)
            .set('showComments', false)
            .set('isParentPost', true)
            .set('realName', 'Joe Karlsson')
            .set('username', 'joejoebinks3')
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
      });

    default:
      return state
  }
}

export default authReducer;
