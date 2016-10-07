/*
  eslint no-undef: 0
*/

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
import App from './App';
import AllPosts from './posts/allPosts/AllPosts';
import Profile from './profile/profilePage/Profile';
import EditProfile from './profile/editProfile/EditProfile';
import Login from './shared/auth/login/Login';
import Logout from './shared/auth/logout/Logout';
import About from './static/about/About';
import NoMatch from './static/noMatch/NoMatch';

const store = configureStore();

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ browserHistory }>
      <Route path='/' component={ App }>
        <IndexRoute component={ AllPosts } />
        <Route path='/about' component={ About } />
        <Route path='/user/:userName' component={ Profile } />
        <Route path='/user/:userName/edit' component={ EditProfile } />
        <Route path='/login' component={ Login } />
        <Route path="access_token=:token" component={Login} /> //to prevent router errors
        <Route path='/logout' component={ Logout } />
        <Route path='*' component={ NoMatch } />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
