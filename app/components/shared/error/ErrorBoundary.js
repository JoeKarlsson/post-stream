import React from 'react';
import { logError } from '../../../utils/errorLogger';
import styles from './ErrorBoundary.module.scss';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        const errorDetails = {
            error: error.toString(),
            errorInfo: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        logError('React Error Boundary', errorDetails);

        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className={styles.errorBoundary}>
                    <div className={styles.errorContainer}>
                        <h2 className={styles.errorTitle}>Something went wrong</h2>
                        <p className={styles.errorMessage}>
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>

                        {process.env.NODE_ENV === 'development' && (
                            <details className={styles.errorDetails}>
                                <summary>Error Details (Development Only)</summary>
                                <pre className={styles.errorStack}>
                                    {this.state.error && this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className={styles.errorActions}>
                            <button
                                className={styles.retryButton}
                                onClick={this.handleRetry}
                            >
                                Try Again
                            </button>
                            <button
                                className={styles.refreshButton}
                                onClick={() => window.location.reload()}
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
