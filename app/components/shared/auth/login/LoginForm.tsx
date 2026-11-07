import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../../../slices/userSlice";
import { AppDispatch } from "../../../../slices";
import TextButton from "../../textButton/TextButton";
import styles from "./LoginForm.module.scss";

type FieldName =
  | "email"
  | "password"
  | "confirmPassword"
  | "username"
  | "first_name"
  | "last_name"
  | "bio";

const emptyForm: Record<FieldName, string> = {
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
  first_name: "",
  last_name: "",
  bio: "",
};

// Mirrors the User model's rules in server/models/user.js
const validate = (form: typeof emptyForm, isRegister: boolean) => {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "enter a valid email";
  if (form.password.length < 6) errors.password = "use at least 6 characters";
  if (isRegister) {
    if (!/^[a-zA-Z0-9]{3,20}$/.test(form.username)) {
      errors.username = "3 to 20 letters or numbers";
    }
    if (form.confirmPassword !== form.password) {
      errors.confirmPassword = "passwords don't match";
    }
  }
  return errors;
};

const LoginForm = ({ isRegister }: { isRegister: boolean }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form, isRegister);
    setErrors(found);
    setServerError("");
    if (Object.keys(found).length > 0) return;

    setIsLoading(true);
    try {
      if (isRegister) {
        const { email, password, username, first_name, last_name, bio } = form;
        await dispatch(
          registerUser({ email, password, username, first_name, last_name, bio })
        ).unwrap();
      } else {
        await dispatch(loginUser({ email: form.email, password: form.password })).unwrap();
      }
    } catch (error) {
      // unwrap() rejects with the thunk's rejectWithValue message
      setServerError(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const field = (
    name: FieldName,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <p id={`${name}-error`} className={styles.fieldError}>
          {errors[name]}
        </p>
      )}
    </>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {serverError && <p role="alert">{serverError}</p>}

      {isRegister && (
        <>
          {field("username", "username", { autoComplete: "username" })}
          {field("first_name", "first name", { autoComplete: "given-name" })}
          {field("last_name", "last name", { autoComplete: "family-name" })}
          <label htmlFor="bio">bio (optional)</label>
          <textarea id="bio" name="bio" rows={3} value={form.bio} onChange={handleChange} />
        </>
      )}

      {field("email", "email", { type: "email", autoComplete: "email" })}
      {field("password", "password", {
        type: "password",
        autoComplete: isRegister ? "new-password" : "current-password",
      })}
      {isRegister &&
        field("confirmPassword", "confirm password", {
          type: "password",
          autoComplete: "new-password",
        })}

      <TextButton type="submit" disabled={isLoading}>
        {isLoading ? "one sec..." : isRegister ? "create account" : "sign in"}
      </TextButton>
    </form>
  );
};

export default LoginForm;
