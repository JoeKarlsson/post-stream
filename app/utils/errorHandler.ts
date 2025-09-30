/**
 * Standardized error handling utilities
 * Provides consistent error handling patterns across the application
 */

import { logError, logApiError, logActionError } from "./errorLogger";
import { ErrorResponse } from "../types";

/**
 * Standard error response format
 */
export const createErrorResponse = (
  message: string,
  code: string = "UNKNOWN_ERROR"
): ErrorResponse => {
  return {
    error: {
      message,
      code,
    },
  };
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (
  error: unknown,
  endpoint: string,
  requestData: Record<string, unknown> = {}
): ErrorResponse => {
  let errorMessage = "An unexpected error occurred";
  let errorCode = "API_ERROR";

  if (error && typeof error === "object" && "response" in error) {
    // Server responded with error status
    const response = error.response as {
      status: number;
      data: { error?: string; message?: string };
    };
    const status = response.status;
    const data = response.data;

    errorMessage = data?.error || data?.message || `Server error (${status})`;
    errorCode = `HTTP_${status}`;

    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        errorMessage = data?.error || "Bad request";
        errorCode = "BAD_REQUEST";
        break;
      case 401:
        errorMessage = "Authentication required";
        errorCode = "UNAUTHORIZED";
        break;
      case 403:
        errorMessage = "Access forbidden";
        errorCode = "FORBIDDEN";
        break;
      case 404:
        errorMessage = "Resource not found";
        errorCode = "NOT_FOUND";
        break;
      case 422:
        errorMessage = data?.error || "Validation error";
        errorCode = "VALIDATION_ERROR";
        break;
      case 500:
        errorMessage = "Internal server error";
        errorCode = "SERVER_ERROR";
        break;
      default:
        errorMessage = data?.error || `Server error (${status})`;
        errorCode = `HTTP_${status}`;
    }
  } else if (error && typeof error === "object" && "request" in error) {
    // Network error
    errorMessage = "Network error - please check your connection";
    errorCode = "NETWORK_ERROR";
  } else {
    // Other error
    const errorObj = error as { message?: string };
    errorMessage = errorObj.message || "An unexpected error occurred";
    errorCode = "UNKNOWN_ERROR";
  }

  // Log the error
  logApiError(endpoint, error, {
    requestData,
    errorMessage,
    errorCode,
  });

  return createErrorResponse(errorMessage, errorCode);
};

/**
 * Handle component errors
 */
export const handleComponentError = (
  error: unknown,
  componentName: string,
  props: Record<string, unknown> = {}
): ErrorResponse => {
  const errorObj = error as { message?: string };
  const errorMessage = errorObj.message || "Component error occurred";

  logError("Component", error, {
    component: componentName,
    props: sanitizeProps(props),
  });

  return createErrorResponse(errorMessage, "COMPONENT_ERROR");
};

/**
 * Handle action errors
 */
export const handleActionError = (
  error: unknown,
  actionType: string,
  payload: Record<string, unknown> = {}
): ErrorResponse => {
  const errorObj = error as { message?: string };
  const errorMessage = errorObj.message || "Action error occurred";

  logActionError(actionType, error, payload);

  return createErrorResponse(errorMessage, "ACTION_ERROR");
};

/**
 * Handle validation errors
 */
export const handleValidationError = (
  errors: string[],
  field: string | null = null
): ErrorResponse => {
  const errorMessage = field
    ? `Validation error in ${field}: ${errors.join(", ")}`
    : `Validation errors: ${errors.join(", ")}`;

  return createErrorResponse(errorMessage, "VALIDATION_ERROR");
};

/**
 * Handle authentication errors
 */
export const handleAuthError = (error: unknown): ErrorResponse => {
  let errorMessage = "Authentication failed";
  let errorCode = "AUTH_ERROR";

  const errorObj = error as { message?: string };
  if (errorObj.message) {
    if (errorObj.message.includes("token")) {
      errorMessage = "Invalid or expired token";
      errorCode = "INVALID_TOKEN";
    } else if (errorObj.message.includes("password")) {
      errorMessage = "Invalid password";
      errorCode = "INVALID_PASSWORD";
    } else if (errorObj.message.includes("user")) {
      errorMessage = "User not found";
      errorCode = "USER_NOT_FOUND";
    } else {
      errorMessage = errorObj.message;
    }
  }

  logError("Authentication", error);

  return createErrorResponse(errorMessage, errorCode);
};

/**
 * Handle network errors
 */
export const handleNetworkError = (error: unknown): ErrorResponse => {
  const errorMessage = "Network error - please check your connection";

  logError("Network", error);

  return createErrorResponse(errorMessage, "NETWORK_ERROR");
};

/**
 * Sanitize props for logging (remove sensitive data)
 */
const sanitizeProps = (
  props: Record<string, unknown>
): Record<string, unknown> => {
  const sensitiveKeys = ["password", "token", "secret", "key", "authorization"];
  const sanitized = { ...props };

  Object.keys(sanitized).forEach((key) => {
    if (
      sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))
    ) {
      sanitized[key] = "[REDACTED]";
    }
  });

  return sanitized;
};

/**
 * Check if error is a specific type
 */
export const isErrorType = (error: unknown, type: string): boolean => {
  if (!error || typeof error !== "object" || !("error" in error)) return false;
  const errorObj = error as { error: { code?: string } };
  return errorObj.error.code === type;
};

/**
 * Extract user-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "error" in error) {
    const errorObj = error as { error: { message?: string } };
    if (errorObj.error.message) return errorObj.error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    const errorObj = error as { message: string };
    return errorObj.message;
  }
  return "An unexpected error occurred";
};

/**
 * Extract error code
 */
export const getErrorCode = (error: unknown): string => {
  if (error && typeof error === "object" && "error" in error) {
    const errorObj = error as { error: { code?: string } };
    if (errorObj.error.code) return errorObj.error.code;
  }
  return "UNKNOWN_ERROR";
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: unknown): boolean => {
  const retryableCodes = [
    "NETWORK_ERROR",
    "SERVER_ERROR",
    "HTTP_500",
    "HTTP_502",
    "HTTP_503",
    "HTTP_504",
  ];

  const errorCode = getErrorCode(error);
  return retryableCodes.includes(errorCode);
};

/**
 * Create a retry function for failed operations
 */
export const createRetryFunction = <T extends unknown[], R>(
  operation: (...args: T) => Promise<R>,
  maxRetries: number = 3,
  delay: number = 1000
) => {
  return async (...args: T): Promise<R> => {
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
        await new Promise<void>((resolve) => {
          globalThis.setTimeout(() => resolve(), delay * attempt);
        });
      }
    }

    throw lastError;
  };
};
