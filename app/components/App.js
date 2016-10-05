/*
  eslint no-unused-vars: 0
*/

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import Header from './shared/header/Header';
import Footer from './shared/footer/Footer';
import normalize from './shared/styles/normalizer.scss';
import skeleton from './shared/styles/skeleton.scss';
import styles from './App.scss';

class App extends Component {

  render() {
    const {
      dispatch,
      quote,
      isAuthenticated,
      errorMessage
    } = this.props;

    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        isAuthenticated: isAuthenticated,
      })
    }


    return (
      <div className={ styles.app }>
        <Header
          isAuthenticated={isAuthenticated}
          errorMessage={errorMessage}
          dispatch={dispatch}
        />

        <div className={ styles.content }>
          <div className={ skeleton.container }>
            { children }
          </div>
        </div>

        <Footer />
      </div>
    );
  }
};

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
}

function mapStateToProps(state) {
  const { auth } = state.root;
  const { isAuthenticated, errorMessage } = auth

  return {
    isAuthenticated,
    errorMessage
  }
}

export default connect(mapStateToProps)(App)
