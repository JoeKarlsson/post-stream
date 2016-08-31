import React from 'react';
import styles from './Register.scss';

class Register extends React.Component {
  render() {
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

            />
            <label htmlFor='password'>password</label>
            <input
              ref='password'
              type='password'
              id='password'
              className='u-full-width'
              placeholder='password'

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

export default Register;
