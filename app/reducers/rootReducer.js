import { combineReducers } from 'redux';
import postReducer from './postReducer';
import auth from './authReducer';

const rootReducer = combineReducers({
  postReducer,
  auth
})

export default rootReducer;
