import { Outlet } from "react-router-dom";
import Header from "./shared/header/Header";
import Footer from "./shared/footer/Footer";
import ErrorBoundary from "./shared/error/ErrorBoundary";
import { useKeyboardShortcuts } from "./shared/keyboard/shortcuts";
import DemoBanner from "../demo/DemoBanner";
import base from "./shared/styles/base.module.scss";
import styles from "./App.module.scss";

// Only the static demo build (vite --mode demo) shows the demo banner
const IS_DEMO = import.meta.env.MODE === "demo";

const App = () => {
  useKeyboardShortcuts();

  return (
    <ErrorBoundary>
      <div className={styles.app}>
        <a className={styles.skipLink} href="#main">
          skip to content
        </a>
        {IS_DEMO && <DemoBanner />}
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
