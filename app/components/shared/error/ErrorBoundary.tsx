import React from "react";
import { logError } from "../../../utils/errorLogger";
import TextButton from "../textButton/TextButton";
import styles from "./ErrorBoundary.module.scss";

interface ErrorBoundaryState {
  error: Error | null;
  componentStack: string | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null, componentStack: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError("React Error Boundary", {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      url: window.location.href,
    });
    this.setState({ componentStack: errorInfo.componentStack ?? null });
  }

  render() {
    const { error, componentStack } = this.state;
    if (!error) {
      return this.props.children;
    }

    return (
      <main className={styles.errorBoundary}>
        <h1>something broke</h1>
        <p>PostStream hit an error it couldn&rsquo;t recover from. reloading usually fixes it.</p>

        {import.meta.env.DEV && (
          <details>
            <summary>error details (only shown in development)</summary>
            <pre className={styles.errorStack}>
              {error.toString()}
              {componentStack}
            </pre>
          </details>
        )}

        <p>
          <TextButton onClick={() => this.setState({ error: null, componentStack: null })}>
            try again
          </TextButton>
          <TextButton onClick={() => window.location.reload()}>reload the page</TextButton>
        </p>
      </main>
    );
  }
}

export default ErrorBoundary;
