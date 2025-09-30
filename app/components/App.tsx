/*
  eslint no-unused-vars: 0
*/

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "./shared/header/Header";
import Footer from "./shared/footer/Footer";
import ErrorBoundary from "./shared/error/ErrorBoundary";
import skeleton from "./shared/styles/skeleton.module.scss";
import styles from "./App.module.scss";
import { RootState } from "../slices";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);
  const user = useSelector((state: RootState) => state.user.profile);

  const isAuthenticated: boolean = profile.isAuthenticated || false;
  const errorMessage: string = profile.errorMessage || "";
  const errorCode: string = profile.errorCode || "";

  return (
    <ErrorBoundary>
      <div className={styles.app}>
        <Header
          isAuthenticated={isAuthenticated}
          errorMessage={errorMessage}
          errorCode={errorCode}
          dispatch={dispatch}
          user={user}
        />

        <div className={styles.content}>
          <div className={skeleton.container}>
            <Outlet context={{ isAuthenticated }} />
          </div>
        </div>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
