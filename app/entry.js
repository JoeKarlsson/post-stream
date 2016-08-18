import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import NoMatch from './static/noMatch/NoMatch.js';
import About from './static/about/About.js';
import NewsStream from './posts/allPosts/NewsStream.js';
import App from './App';

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path='/' component={ App }>
      <IndexRoute component={ NewsStream } />
      <Route path='/about' component={ About } />
      <Route path='*' component={ NoMatch } />
    </Route>
  </Router>,
  document.getElementById('root')
);