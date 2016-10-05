import { combineReducers } from 'redux';
import post from './postReducer';
import auth from './authReducer';
import profile from './profileReducer';

const root = combineReducers({
  post,
  auth,
  profile,
})

export default root;
