import { combineReducers } from 'redux';
import post from './postReducer';
import post2 from './post2';
import auth from './authReducer';

const root = combineReducers({
  post,
  post2,
  auth
})

export default root;
