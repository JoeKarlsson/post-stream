/**
 * Centralized error logging utility
 * Provides consistent error handling and logging across the application
 */

class ErrorLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 100; // Keep only last 100 errors in memory
    }

    /**
     * Log an error with context
     * @param {string} source - Where the error occurred (component, action, etc.)
     * @param {Error|Object} error - The error object or error details
     * @param {Object} context - Additional context about the error
     */
    log(source, error, context = {}) {
        const errorEntry = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            source,
            error: this.serializeError(error),
            context,
            userAgent: navigator.userAgent,
            url: window.location.href,
            userId: this.getCurrentUserId()
        };

        // Add to in-memory logs
        this.logs.unshift(errorEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(0, this.maxLogs);
        }

        // Console logging in development
        if (process.env.NODE_ENV === 'development') {
            console.group(`🚨 Error in ${source}`);
            console.error('Error:', error);
            console.log('Context:', context);
            console.log('Timestamp:', errorEntry.timestamp);
            console.groupEnd();
        }

        // Send to external logging service in production
        if (process.env.NODE_ENV === 'production') {
            this.sendToExternalService(errorEntry);
        }

        // Store in localStorage for debugging
        this.storeInLocalStorage(errorEntry);

        return errorEntry.id;
    }

    /**
     * Serialize error object for logging
     */
    serializeError(error) {
        if (error instanceof Error) {
            return {
                name: error.name,
                message: error.message,
                stack: error.stack,
                cause: error.cause
            };
        }

        if (typeof error === 'string') {
            return { message: error };
        }

        if (typeof error === 'object' && error !== null) {
            return error;
        }

        return { message: String(error) };
    }

    /**
     * Generate unique ID for error entry
     */
    generateId() {
        return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get current user ID from localStorage
     */
    getCurrentUserId() {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.id || user.user_id || null;
        } catch {
            return null;
        }
    }

    /**
     * Store error in localStorage for debugging
     */
    storeInLocalStorage(errorEntry) {
        try {
            const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
            existingErrors.unshift(errorEntry);

            // Keep only last 50 errors in localStorage
            const trimmedErrors = existingErrors.slice(0, 50);
            localStorage.setItem('app_errors', JSON.stringify(trimmedErrors));
        } catch (error) {
            console.warn('Failed to store error in localStorage:', error);
        }
    }

    /**
     * Send error to external logging service
     */
    async sendToExternalService(errorEntry) {
        try {
            // Example: Send to your logging service
            // await fetch('/api/logs', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(errorEntry)
            // });

            // For now, just log to console in production
            console.error('Production Error:', errorEntry);
        } catch (error) {
            console.warn('Failed to send error to external service:', error);
        }
    }

    /**
     * Get recent errors
     */
    getRecentErrors(limit = 10) {
        return this.logs.slice(0, limit);
    }

    /**
     * Clear all stored errors
     */
    clearErrors() {
        this.logs = [];
        localStorage.removeItem('app_errors');
    }

    /**
     * Get errors from localStorage
     */
    getStoredErrors() {
        try {
            return JSON.parse(localStorage.getItem('app_errors') || '[]');
        } catch {
            return [];
        }
    }
}

// Create singleton instance
const errorLogger = new ErrorLogger();

/**
 * Convenience function to log errors
 */
export const logError = (source, error, context = {}) => {
    return errorLogger.log(source, error, context);
};

/**
 * Log API errors with standardized format
 */
export const logApiError = (endpoint, error, requestData = {}) => {
    return errorLogger.log('API', error, {
        endpoint,
        requestData,
        type: 'api_error'
    });
};

/**
 * Log component errors
 */
export const logComponentError = (componentName, error, props = {}) => {
    return errorLogger.log('Component', error, {
        component: componentName,
        props: this.sanitizeProps(props),
        type: 'component_error'
    });
};

/**
 * Log action errors
 */
export const logActionError = (actionType, error, payload = {}) => {
    return errorLogger.log('Action', error, {
        actionType,
        payload: this.sanitizePayload(payload),
        type: 'action_error'
    });
};

/**
 * Sanitize props for logging (remove sensitive data)
 */
function sanitizeProps(props) {
    const sensitiveKeys = ['password', 'token', 'secret', 'key'];
    const sanitized = { ...props };

    Object.keys(sanitized).forEach(key => {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
            sanitized[key] = '[REDACTED]';
        }
    });

    return sanitized;
}

/**
 * Sanitize payload for logging
 */
function sanitizePayload(payload) {
    return sanitizeProps(payload);
}

export default errorLogger;
