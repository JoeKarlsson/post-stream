import { Map, List, Immutable } from 'immutable';

const initialState = Map({
  posts: List(),
});

const postReducer = (state = initialState, action) => {

  let newState = state;

  switch(action.type) {
    case 'REMOVE_ITEM':
      break;

    case 'SET_ITEMS':
      return state.updateIn(['posts'], (list) => {
        return list.concat(action.data.posts);
      });

    default:
      newState;
  }
  return newState;
};

export default postReducer;
