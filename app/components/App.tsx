import { Outlet } from "react-router-dom";
import Header from "./shared/header/Header";
import Footer from "./shared/footer/Footer";
import ErrorBoundary from "./shared/error/ErrorBoundary";
import { useKeyboardShortcuts } from "./shared/keyboard/shortcuts";
import base from "./shared/styles/base.module.scss";
import styles from "./App.module.scss";

const App = () => {
  useKeyboardShortcuts();

  return (
    <ErrorBoundary>
      <div className={styles.app}>
        <a className={styles.skipLink} href="#main">
          skip to content
        </a>
        <Header />
        <main id="main" className={styles.content}>
          <div className={base.container}>
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
