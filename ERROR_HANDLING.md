# Error Handling System

This document describes the comprehensive error handling system implemented in the PostStream application.

## Overview

The error handling system provides:

- **Global Error Boundary**: Catches unhandled React errors
- **Centralized Error Logging**: Consistent error tracking and logging
- **Standardized Error Handling**: Uniform error handling patterns across the app
- **User-Friendly Error Display**: Consistent error UI components

## Components

### 1. ErrorBoundary (`app/components/shared/error/ErrorBoundary.js`)

A React error boundary that catches JavaScript errors anywhere in the component tree, logs them, and displays a fallback UI.

**Features:**

- Catches unhandled React errors
- Logs errors with context
- Shows user-friendly error message
- Provides retry functionality
- Shows detailed error info in development mode

**Usage:**

```jsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 2. ErrorDisplay (`app/components/shared/error/ErrorDisplay.js`)

A reusable component for displaying errors consistently across the application.

**Props:**

- `error`: Error object or error details
- `onRetry`: Function to call when retry is clicked
- `onDismiss`: Function to call when dismiss is clicked
- `showRetry`: Whether to show retry button (default: true)
- `showDismiss`: Whether to show dismiss button (default: true)
- `size`: Size variant - 'small', 'medium', 'large' (default: 'medium')
- `title`: Custom error title (default: 'Error')

**Usage:**

```jsx
<ErrorDisplay
  error={error}
  onRetry={handleRetry}
  onDismiss={handleDismiss}
  size="small"
  title="Login Failed"
/>
```

### 3. Error Logger (`app/utils/errorLogger.js`)

Centralized error logging utility that provides consistent error tracking.

**Features:**

- Structured error logging with context
- In-memory error storage
- localStorage persistence for debugging
- External service integration ready
- Sensitive data sanitization

**Usage:**

```javascript
import { logError, logApiError, logActionError } from '../utils/errorLogger';

// General error logging
logError('ComponentName', error, { context: 'additional info' });

// API error logging
logApiError('/api/endpoint', error, { requestData });

// Action error logging
logActionError('ACTION_TYPE', error, { payload });
```

### 4. Error Handler (`app/utils/errorHandler.js`)

Standardized error handling utilities for consistent error processing.

**Features:**

- Standardized error response format
- API error handling with HTTP status codes
- Component error handling
- Action error handling
- Validation error handling
- Authentication error handling
- Network error handling
- Retry logic for retryable errors

**Usage:**

```javascript
import { handleApiError, handleComponentError, createErrorResponse } from '../utils/errorHandler';

// Handle API errors
const errorResponse = handleApiError(error, endpoint, requestData);

// Handle component errors
const errorResponse = handleComponentError(error, 'ComponentName', props);

// Create standardized error response
const errorResponse = createErrorResponse('Error message', 'ERROR_CODE', { details });
```

## Error Types

### API Errors

- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **422**: Validation Error
- **500**: Internal Server Error
- **Network**: Network connectivity issues

### Component Errors

- **Component**: React component errors
- **Action**: Redux action errors
- **Validation**: Form validation errors
- **Authentication**: Auth-related errors

## Error Codes

The system uses standardized error codes for consistent error handling:

- `API_ERROR`: General API errors
- `BAD_REQUEST`: 400 HTTP status
- `UNAUTHORIZED`: 401 HTTP status
- `FORBIDDEN`: 403 HTTP status
- `NOT_FOUND`: 404 HTTP status
- `VALIDATION_ERROR`: 422 HTTP status
- `SERVER_ERROR`: 500 HTTP status
- `NETWORK_ERROR`: Network connectivity issues
- `COMPONENT_ERROR`: React component errors
- `ACTION_ERROR`: Redux action errors
- `AUTH_ERROR`: Authentication errors
- `INVALID_TOKEN`: Token validation errors
- `INVALID_PASSWORD`: Password validation errors
- `USER_NOT_FOUND`: User lookup errors

## Integration

### Redux Integration

The error handling system integrates with Redux through:

1. **Error State Management**: Errors are stored in Redux state with consistent structure
2. **Action Error Handling**: All actions use standardized error handling
3. **Error Clearing**: `CLEAR_ERROR` action to dismiss errors

### Middleware Integration

Both API middleware files (`api.js` and `localApi.js`) have been updated to:

1. Use centralized error logging
2. Apply standardized error handling
3. Return consistent error responses
4. Handle authentication errors appropriately

### Component Integration

Components can display errors using:

1. **ErrorDisplay Component**: For consistent error UI
2. **Error Boundary**: For unhandled errors
3. **Redux State**: For error messages from actions

## Best Practices

### 1. Error Logging

- Always log errors with context
- Use appropriate logging functions (`logError`, `logApiError`, `logActionError`)
- Include relevant data but sanitize sensitive information

### 2. Error Display

- Use `ErrorDisplay` component for consistent UI
- Provide meaningful error messages to users
- Include retry functionality for retryable errors
- Allow users to dismiss non-critical errors

### 3. Error Handling

- Use `handleApiError` for API calls
- Use `handleComponentError` for component errors
- Use `handleActionError` for Redux actions
- Check error codes for specific handling

### 4. Error Recovery

- Implement retry logic for network errors
- Provide fallback UI for critical errors
- Clear errors when appropriate
- Handle authentication errors by redirecting to login

## Development vs Production

### Development Mode

- Detailed error information displayed
- Error codes shown in UI
- Console logging with full context
- Error boundary shows stack traces

### Production Mode

- User-friendly error messages only
- Sensitive information hidden
- External logging service integration
- Graceful error recovery

## Monitoring and Debugging

### Error Storage

- In-memory storage (last 100 errors)
- localStorage persistence (last 50 errors)
- External service integration ready

### Error Access

```javascript
import errorLogger from '../utils/errorLogger';

// Get recent errors
const recentErrors = errorLogger.getRecentErrors(10);

// Get stored errors from localStorage
const storedErrors = errorLogger.getStoredErrors();

// Clear all errors
errorLogger.clearErrors();
```

## Future Enhancements

1. **External Logging Service**: Integration with services like Sentry, LogRocket, or DataDog
2. **Error Analytics**: Error frequency and pattern analysis
3. **User Feedback**: Allow users to report errors
4. **Error Recovery**: Automatic retry mechanisms
5. **Performance Monitoring**: Track error impact on performance

## Migration Guide

To migrate existing error handling:

1. **Replace console.error**: Use `logError` instead
2. **Update API calls**: Use `handleApiError` for consistent handling
3. **Add Error Boundaries**: Wrap components with `ErrorBoundary`
4. **Use ErrorDisplay**: Replace custom error UI with `ErrorDisplay`
5. **Update Reducers**: Handle `errorCode` in addition to `errorMessage`

## Examples

### Basic Error Handling

```javascript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  const errorResponse = handleApiError(error, '/api/endpoint', { data });
  logApiError('/api/endpoint', error, { data });
  throw errorResponse;
}
```

### Component Error Display

```jsx
const MyComponent = () => {
  const [error, setError] = useState(null);
  
  const handleRetry = () => {
    setError(null);
    // Retry logic
  };
  
  return (
    <div>
      {error && (
        <ErrorDisplay
          error={error}
          onRetry={handleRetry}
          onDismiss={() => setError(null)}
          title="Operation Failed"
        />
      )}
      {/* Component content */}
    </div>
  );
};
```

### Redux Action Error Handling

```javascript
const myAction = () => ({
  [api]: {
    endpoint: '/api/endpoint',
    method: 'POST',
    body: JSON.stringify(data),
    authenticated: true,
    types: ['REQUEST', 'SUCCESS', 'FAILURE']
  }
});
```

The reducer will automatically receive standardized error information:

```javascript
case 'FAILURE':
  return state.set('errorMessage', action.error)
    .set('errorCode', action.errorCode);
```
