import React from 'react';
import ReactDOM from 'react-dom';
import {
  Router,
  Route,
  browserHistory,
  IndexRoute
} from 'react-router';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import NoMatch from './static/noMatch/NoMatch.js';
import About from './static/about/About.js';
import AllPosts from './posts/allPosts/AllPosts.js';
import App from './App';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={ browserHistory }>
      <Route path='/' component={ App }>
        <IndexRoute component={ AllPosts } />
        <Route path='/about' component={ About } />
        <Route path='*' component={ NoMatch } />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);