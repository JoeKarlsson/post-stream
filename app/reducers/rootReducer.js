import { combineReducers } from 'redux';
import postReducer from './postReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  postReducer,
  authReducer
})

export default rootReducer;
