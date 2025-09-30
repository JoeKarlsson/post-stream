import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import LoginForm from './LoginForm';
import './Login.module.scss';

const Login = ({ history }) => {
  const [isRegister, setIsRegister] = useState(false);
  const { profile } = useSelector(state => state.root);

  const isAuthenticated = profile.get('isAuthenticated');
  const isFetching = profile.get('isFetching');
  const errorMessage = profile.get('errorMessage');

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

export default Login;