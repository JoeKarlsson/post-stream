import React from 'react';
import { connect } from 'react-redux';
import {
  handleLogin,
} from '../../../actions/loginActions';
import styles from './Login.scss';

class Login extends React.Component {
  constructor() {
    super();
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(handleLogin(e.target.value))
  }

  render() {
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
              value={this.props.newPostBody}
              onChange={this.handleBodyChange}
            />
            <label htmlFor='password'>password</label>
            <input
              ref='password'
              type='password'
              id='password'
              className='u-full-width'
              placeholder='password'
              value={this.props.newPostBody}
              onChange={this.handleBodyChange}
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
  console.log('state: ', state);
  return {

  }
};

export default connect(
  mapStateToProps
)(Login);
