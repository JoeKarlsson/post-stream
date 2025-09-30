import React, { useState } from 'react';
import { connect } from 'react-redux';
import LoginForm from './LoginForm';
import './Login.scss';

const Login = ({ isAuthenticated, history }) => {
  const [isRegister, setIsRegister] = useState(false);

  const handleSuccess = () => {
    if (history) {
      history.push('/');
    }
  };

  if (isAuthenticated) {
    if (history) {
      history.push('/');
    }
    return null;
  }

  return (
    <div className="login">
      <div className="login-container">
        <h1>PostStream</h1>
        <p>{isRegister ? 'Create your account' : 'Sign in to your account'}</p>

        <LoginForm
          isRegister={isRegister}
          onSuccess={handleSuccess}
        />

        <div className="auth-switch">
          <p>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              className="switch-button"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  const { profile } = state.root;

  return {
    isAuthenticated: profile.get('isAuthenticated'),
    isFetching: profile.get('isFetching'),
    errorMessage: profile.get('errorMessage')
  };
}

export default connect(mapStateToProps)(Login);