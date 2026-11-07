import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import TextButton from "../../textButton/TextButton";
import { RootState } from "../../../../slices";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1>{isRegister ? "create an account" : "sign in"}</h1>

      {/* key resets the form's fields when switching modes */}
      <LoginForm key={String(isRegister)} isRegister={isRegister} />

      <p>
        {isRegister ? "already have an account? " : "new here? "}
        <TextButton onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "sign in" : "create an account"}
        </TextButton>
      </p>
    </div>
  );
};

export default Login;
