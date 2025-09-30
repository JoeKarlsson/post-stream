import React from 'react';
import { getErrorMessage, getErrorCode, isRetryableError } from '../../../utils/errorHandler';
import styles from './ErrorDisplay.module.scss';

const ErrorDisplay = ({
    error,
    onRetry,
    onDismiss,
    showRetry = true,
    showDismiss = true,
    className = '',
    title = 'Error',
    size = 'medium' // 'small', 'medium', 'large'
}) => {
    if (!error) return null;

    const errorMessage = getErrorMessage(error);
    const errorCode = getErrorCode(error);
    const canRetry = showRetry && onRetry && isRetryableError(error);

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        }
    };

    const handleDismiss = () => {
        if (onDismiss) {
            onDismiss();
        }
    };

    return (
        <div className={`${styles.errorDisplay} ${styles[size]} ${className}`}>
            <div className={styles.errorIcon}>
                ⚠️
            </div>

            <div className={styles.errorContent}>
                <h3 className={styles.errorTitle}>{title}</h3>
                <p className={styles.errorMessage}>{errorMessage}</p>

                {process.env.NODE_ENV === 'development' && errorCode && (
                    <p className={styles.errorCode}>Error Code: {errorCode}</p>
                )}
            </div>

            {(canRetry || showDismiss) && (
                <div className={styles.errorActions}>
                    {canRetry && (
                        <button
                            className={styles.retryButton}
                            onClick={handleRetry}
                        >
                            Try Again
                        </button>
                    )}

                    {showDismiss && (
                        <button
                            className={styles.dismissButton}
                            onClick={handleDismiss}
                        >
                            Dismiss
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ErrorDisplay;
