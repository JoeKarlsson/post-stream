import { Map, List } from 'immutable';

const initialState = Map({
  isFetching: false,
  didInvalidate: false,
  lastUpdated: null,
  newPostBody: '',
  submittingPost: false,
  posts: List(),
});

const postReducer = (state = initialState, action) => {

  switch(action.type) {
    case 'INVALIDATE_POSTS':
      return state.update(['didInvalidate'], _ => true);

    case 'REQUEST_POSTS':
      return state.update(['isFetching'], _ => true)
        .update(['didInvalidate'], _ => false);

    case 'RECEIVE_POSTS':
      return state.updateIn(['posts'], (list) => {
        return list.concat(action.posts);
      })
      .update(['isFetching'], _ => false)
      .update(['didInvalidate'], _ => false)
      .update(['lastUpdated'], _ => action.receivedAt);

    case 'HANDLE_NEW_POST_BODY_CHANGE':
      return state.set('newPostBody', action.body)

    case "REQUEST_NEW_POSTS":
      return state.update(['submittingPost'], _ => true);

    case "RECEIVE_NEW_POST":
      return state.updateIn(['posts'], (list) => {
        return list.push(action.newPost);
      })
      .update(['submittingPost'], _ => false)
      .set('newPostBody', '')

    default:
      return state;
  }
};

export default postReducer;
