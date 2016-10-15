import React, { Component, PropTypes } from 'react';
import styles from './Login.scss';

export default class Login extends Component {
  render() {
    const { errorMessage } = this.props;

    return (
      <div>
        <li>[ <span className={styles.loginButton} onClick={(event) => this.handleClick(event)}>login</span> ]</li>

        {errorMessage &&
          <p style={{color:'red'}}>{errorMessage}</p>
        }
      </div>
    )
  }

  handleClick(event) {
    this.props.onLoginClick();
  };
};

Login.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
};