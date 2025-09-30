/**
 * Standardized error handling utilities
 * Provides consistent error handling patterns across the application
 */

import { logError, logApiError, logActionError } from './errorLogger';

/**
 * Standard error response format
 */
export const createErrorResponse = (message, code = 'UNKNOWN_ERROR', details = {}) => {
    return {
        success: false,
        error: {
            message,
            code,
            details,
            timestamp: new Date().toISOString()
        }
    };
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error, endpoint, requestData = {}) => {
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'API_ERROR';

    if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;

        errorMessage = data?.error || data?.message || `Server error (${status})`;
        errorCode = `HTTP_${status}`;

        // Handle specific HTTP status codes
        switch (status) {
            case 400:
                errorMessage = data?.error || 'Bad request';
                errorCode = 'BAD_REQUEST';
                break;
            case 401:
                errorMessage = 'Authentication required';
                errorCode = 'UNAUTHORIZED';
                break;
            case 403:
                errorMessage = 'Access forbidden';
                errorCode = 'FORBIDDEN';
                break;
            case 404:
                errorMessage = 'Resource not found';
                errorCode = 'NOT_FOUND';
                break;
            case 422:
                errorMessage = data?.error || 'Validation error';
                errorCode = 'VALIDATION_ERROR';
                break;
            case 500:
                errorMessage = 'Internal server error';
                errorCode = 'SERVER_ERROR';
                break;
            default:
                errorMessage = data?.error || `Server error (${status})`;
                errorCode = `HTTP_${status}`;
        }
    } else if (error.request) {
        // Network error
        errorMessage = 'Network error - please check your connection';
        errorCode = 'NETWORK_ERROR';
    } else {
        // Other error
        errorMessage = error.message || 'An unexpected error occurred';
        errorCode = 'UNKNOWN_ERROR';
    }

    // Log the error
    logApiError(endpoint, error, {
        requestData,
        errorMessage,
        errorCode
    });

    return createErrorResponse(errorMessage, errorCode, {
        endpoint,
        originalError: error.message
    });
};

/**
 * Handle component errors
 */
export const handleComponentError = (error, componentName, props = {}) => {
    const errorMessage = error.message || 'Component error occurred';

    logError('Component', error, {
        component: componentName,
        props: sanitizeProps(props)
    });

    return createErrorResponse(errorMessage, 'COMPONENT_ERROR', {
        component: componentName
    });
};

/**
 * Handle action errors
 */
export const handleActionError = (error, actionType, payload = {}) => {
    const errorMessage = error.message || 'Action error occurred';

    logActionError(actionType, error, payload);

    return createErrorResponse(errorMessage, 'ACTION_ERROR', {
        actionType
    });
};

/**
 * Handle validation errors
 */
export const handleValidationError = (errors, field = null) => {
    const errorMessage = field
        ? `Validation error in ${field}: ${errors.join(', ')}`
        : `Validation errors: ${errors.join(', ')}`;

    return createErrorResponse(errorMessage, 'VALIDATION_ERROR', {
        errors,
        field
    });
};

/**
 * Handle authentication errors
 */
export const handleAuthError = (error) => {
    let errorMessage = 'Authentication failed';
    let errorCode = 'AUTH_ERROR';

    if (error.message) {
        if (error.message.includes('token')) {
            errorMessage = 'Invalid or expired token';
            errorCode = 'INVALID_TOKEN';
        } else if (error.message.includes('password')) {
            errorMessage = 'Invalid password';
            errorCode = 'INVALID_PASSWORD';
        } else if (error.message.includes('user')) {
            errorMessage = 'User not found';
            errorCode = 'USER_NOT_FOUND';
        } else {
            errorMessage = error.message;
        }
    }

    logError('Authentication', error);

    return createErrorResponse(errorMessage, errorCode);
};

/**
 * Handle network errors
 */
export const handleNetworkError = (error) => {
    const errorMessage = 'Network error - please check your connection';

    logError('Network', error);

    return createErrorResponse(errorMessage, 'NETWORK_ERROR', {
        originalError: error.message
    });
};

/**
 * Sanitize props for logging (remove sensitive data)
 */
const sanitizeProps = (props) => {
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
    const sanitized = { ...props };

    Object.keys(sanitized).forEach(key => {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
            sanitized[key] = '[REDACTED]';
        }
    });

    return sanitized;
};

/**
 * Check if error is a specific type
 */
export const isErrorType = (error, type) => {
    if (!error || !error.error) return false;
    return error.error.code === type;
};

/**
 * Extract user-friendly error message
 */
export const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.error?.message) return error.error.message;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
};

/**
 * Extract error code
 */
export const getErrorCode = (error) => {
    if (error?.error?.code) return error.error.code;
    return 'UNKNOWN_ERROR';
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error) => {
    const retryableCodes = [
        'NETWORK_ERROR',
        'SERVER_ERROR',
        'HTTP_500',
        'HTTP_502',
        'HTTP_503',
        'HTTP_504'
    ];

    const errorCode = getErrorCode(error);
    return retryableCodes.includes(errorCode);
};

/**
 * Create a retry function for failed operations
 */
export const createRetryFunction = (operation, maxRetries = 3, delay = 1000) => {
    return async (...args) => {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation(...args);
            } catch (error) {
                lastError = error;

                if (!isRetryableError(error) || attempt === maxRetries) {
                    throw error;
                }

                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }

        throw lastError;
    };
};
