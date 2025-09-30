/*
  eslint no-unused-vars: 0
*/

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Header from './shared/header/Header';
import Footer from './shared/footer/Footer';
import ErrorBoundary from './shared/error/ErrorBoundary';
import normalize from './shared/styles/normalizer.module.scss';
import skeleton from './shared/styles/skeleton.module.scss';
import styles from './App.module.scss';

const App = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.root);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isAuthenticated = profile.get('isAuthenticated');
  const errorMessage = profile.get('errorMessage');
  const errorCode = profile.get('errorCode');

  return (
    <ErrorBoundary>
      <div className={styles.app}>
        <Header
          isAuthenticated={isAuthenticated}
          errorMessage={errorMessage}
          errorCode={errorCode}
          dispatch={dispatch}
          user={user}
        />

        <div className={styles.content}>
          <div className={skeleton.container}>
            <Outlet context={{ isAuthenticated }} />
          </div>
        </div>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
