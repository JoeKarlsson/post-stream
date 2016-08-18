import Immutable from 'immutable';

const initialState = Immutable.List();

const postReducer = (state = initialState, action) => {

  let newState = state;

  switch(action.type) {
    case 'REMOVE_ITEM':
      return state.delete(action.index);

    case 'SET_ITEMS':
      return Immutable.fromJS(action.data);

    default:
      newState;
  }
  return newState;
};

export default postReducer;
