/*
  eslint no-unused-vars: 0
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Header from './shared/header/Header';
import Footer from './shared/footer/Footer';
import normalize from './shared/styles/normalizer.scss';
import skeleton from './shared/styles/skeleton.scss';
import styles from './App.scss';

class App extends Component {

  render() {
    const {
      dispatch,
      isAuthenticated,
      errorMessage,
      user
    } = this.props;

    return (
      <div className={styles.app}>
        <Header
          isAuthenticated={isAuthenticated}
          errorMessage={errorMessage}
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
    );
  }
};

function mapStateToProps(state) {
  const { profile } = state.root;
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return {
    isAuthenticated: profile.get('isAuthenticated'),
    errorMessage: profile.get('errorMessage'),
    user
  }
}

export default connect(mapStateToProps)(App)
