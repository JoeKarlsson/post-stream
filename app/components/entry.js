/*
  eslint no-undef: 0
*/

import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
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
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<AllPosts />} />
          <Route path='/about' element={<About />} />
          <Route path='/user/:userName' element={<Profile />} />
          <Route path='/user/:userName/edit' element={<EditProfile />} />
          <Route path='/login' element={<Login />} />
          <Route path="access_token=:token" element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='*' element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
