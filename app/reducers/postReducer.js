import { Map, List } from 'immutable';

const initialState = Map({
  isFetching: false,
  didInvalidate: false,
  lastUpdated: null,
  posts: List(),
});

const postReducer = (state = initialState, action) => {

  let newState = state;

  switch(action.type) {
    case 'INVALIDATE_POSTS':
      return state.updateIn(['didInvalidate'], (v) => true);

    case 'REQUEST_POSTS':
      return state.updateIn(['isFetching'], (v) => true)
        .updateIn(['didInvalidate'], (v) => false);

    case 'RECEIVE_POSTS':
      return state.updateIn(['posts'], (list) => {
        return list.concat(action.posts);
      })
      .update(['isFetching'], (v) => false)
      .update(['didInvalidate'], (v) => false)
      .update(['lastUpdated'], (v) => action.receivedAt);

    default:
      newState;
  }
  return newState;
};

export default postReducer;
