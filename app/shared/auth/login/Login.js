import React from 'react';
import { connect } from 'react-redux';
import {
  onUsernameChange,
  onPasswordChange,
  fetchLogin,
} from '../../../actions/loginActions';
import { browserHistory } from 'react-router'
import styles from './Login.scss';

class Login extends React.Component {
  constructor() {
    super();
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleUsernameChange(e) {
    const { dispatch } = this.props;
    dispatch(onUsernameChange(e.target.value))
  }

  handlePasswordChange(e) {
    const { dispatch } = this.props;
    dispatch(onPasswordChange(e.target.value))
  }

  handleLogin(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(fetchLogin())
  }

  render() {
    const { username, password, isLoggedIn } = this.props;
    if (isLoggedIn) {
      browserHistory.push('/');
    }
    return (
      <div className={styles.Login}>
        <h2 className='section-heading'>login to PostStream</h2>
        <div>
          <form>
            <label htmlFor='username'>username</label>
            <input
              ref='username'
              type='text'
              id='username'
              className='u-full-width'
              placeholder='username'
              value={username}
              onChange={this.handleUsernameChange}
            />
            <label htmlFor='password'>password</label>
            <input
              ref='password'
              type='password'
              id='password'
              className='u-full-width'
              placeholder='password'
              value={password}
              onChange={this.handlePasswordChange}
            />
            <div>
              <button onClick={this.handleLogin}>login</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    username: state.rootReducer.authReducer.get('username'),
    password: state.rootReducer.authReducer.get('password'),
    isLoggedIn: state.rootReducer.authReducer.get('isLoggedIn'),
  }
};

export default connect(
  mapStateToProps
)(Login);
