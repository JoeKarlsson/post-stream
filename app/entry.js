import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import * as reducers from './reducers';
import NoMatch from './static/noMatch/NoMatch.js';
import About from './static/about/About.js';
import NewsStream from './posts/allPosts/NewsStream.js';
import App from './App';

const reducer = combineReducers(reducers);
const store = createStore(reducer);

const initialState = store.getState();
console.log('initialState: ', initialState);

ReactDOM.render(
  <Provider store={store}>
    <Router history={ browserHistory }>
      <Route path='/' component={ App }>
        <IndexRoute component={ NewsStream } />
        <Route path='/about' component={ About } />
        <Route path='*' component={ NoMatch } />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);