import {
  createStore,
  applyMiddleware,
  combineReducers
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import * as reducers from '../reducers';
import api from '../middleware/api';
import auth0api from '../middleware/auth0api';

const reducer = combineReducers(reducers);
const loggerMiddleware = createLogger({
  collapsed: true,
  diff: true
});

export default function configureStore(preloadedState) {
  return createStore(
    reducer,
    preloadedState,
    applyMiddleware(
      auth0api,
      api,
      thunkMiddleware,
      loggerMiddleware
    )
  )
};