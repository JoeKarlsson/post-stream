import React from 'react';
import { connect } from 'react-redux';
import {
  onRegistrationFormChange,
  fetchRegisterUser,
} from '../../../../actions/auth/registerActions';
import { browserHistory } from 'react-router'
import styles from './Register.scss';

class Register extends React.Component {
  constructor() {
    super();
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
  }

  handleFormChange(e) {
    const { dispatch } = this.props;
    dispatch(onRegistrationFormChange(e.target.id, e.target.value))
  }

  handleRegistration(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(fetchRegisterUser())
  }

  render() {
    const {
      username,
      password,
      isLoggedIn
    } = this.props;

    if (isLoggedIn) {
      browserHistory.push('/');
    }

    return (
      <div className={styles.Login}>
        <h2 className='section-heading'>register to PostStream</h2>
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
              onChange={this.handleFormChange}
              required
            />
            <label htmlFor='password'>password</label>
            <input
              ref='password'
              type='password'
              id='password'
              className='u-full-width'
              placeholder='password'
              value={password}
              onChange={this.handleFormChange}
              required
            />
            <label htmlFor='first_name'>first name</label>
            <input
              ref='first_name'
              type='first_name'
              id='first_name'
              className='u-full-width'
              placeholder='first_name'
              onChange={this.handleFormChange}
            />
            <label htmlFor='last_name'>last name</label>
            <input
              ref='last_name'
              type='last_name'
              id='last_name'
              className='u-full-width'
              placeholder='last_name'
              onChange={this.handleFormChange}
            />
            <label htmlFor='bio'>bio</label>
            <input
              ref='bio'
              type='bio'
              id='bio'
              className='u-full-width'
              placeholder='bio'
              onChange={this.handleFormChange}
            />
            <div>
              <button onClick={this.handleRegistration}>register</button>
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
    first_name: state.rootReducer.authReducer.get('first_name'),
    last_name: state.rootReducer.authReducer.get('last_name'),
    bio: state.rootReducer.authReducer.get('bio'),
    isLoggedIn: state.rootReducer.authReducer.get('isLoggedIn'),
  }
};

export default connect(
  mapStateToProps
)(Register);
