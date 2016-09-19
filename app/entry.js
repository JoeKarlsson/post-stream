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
import AuthService from './shared/auth/AuthService';
import App from './App';
import AllPosts from './posts/allPosts/AllPosts';
import Profile from './shared/auth/profile/Profile';
import Register from './shared/auth/register/Register';
import Login from './shared/auth/login/Login';
import Logout from './shared/auth/logout/Logout';
import About from './static/about/About';
import NoMatch from './static/noMatch/NoMatch';

const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__);

const store = configureStore();

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ browserHistory }>
      <Route path='/' component={ App } auth={ auth} >
        <IndexRoute component={ AllPosts } />
        <Route path='/about' component={ About } />
        <Route path='/user/:userName' component={ Profile } />
        <Route path='/Register' component={ Register } />
        <Route path='/login' component={ Login } />
        <Route path="access_token=:token" component={Login} /> //to prevent router errors
        <Route path='/logout' component={ Logout } />
        <Route path='*' component={ NoMatch } />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);