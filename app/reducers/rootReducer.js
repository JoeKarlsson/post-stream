import { combineReducers } from 'redux';
import post from './postReducer';
import auth from './authReducer';

const root = combineReducers({
  post,
  auth
})

export default root;
