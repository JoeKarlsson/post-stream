import { Map, List } from 'immutable';

const initialState = Map({
  isFetching: false,
  didInvalidate: false,
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
      const newFoo = state.updateIn(['posts'], (list) => {
        return list.concat(action.data.posts);
      })
      .state.updateIn(['isFetching'], (v) => false)
      .state.updateIn(['didInvalidate'], (v) => false)
      .state.updateIn(['lastUpdated'], (v) => action.receivedAt);
      console.log('newFoo: ', newFoo);
      return newFoo;

    default:
      newState;
  }
  return newState;
};

export default postReducer;
