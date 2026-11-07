import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import { RootState } from "../../../../slices";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login">
      <div className="login-container">
        <h1>PostStream</h1>
        <p>{isRegister ? "Create your account" : "Sign in to your account"}</p>

        <LoginForm isRegister={isRegister} />

        <div className="auth-switch">
          <p>
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              className="switch-button"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
