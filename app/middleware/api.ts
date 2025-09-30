/*
  eslint
  no-unused-vars: 0
  no-undef: 0
*/

import { handleApiError } from '../utils/errorHandler';
import { logApiError } from '../utils/errorLogger';

function callApi(endpoint, authenticated = false, data = {}) {
  let token = localStorage.getItem('id_token') || {};

  let config = {};
  const { method, body, headers } = data;

  if (method) {
    config.method = method;
  }
  if (body) {
    config.body = body;
  }

  if (authenticated) {
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`,
        ...headers
      };
    } else {
      const error = new Error("No token saved!");
      logApiError(endpoint, error, { authenticated, data });
      throw error;
    }
  }

  return fetch(endpoint, config)
    .then(response =>
      response.text()
        .then(text => ({ text, response }))
    ).then(({ text, response }) => {
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.response = { status: response.status, statusText: response.statusText, data: text };
        logApiError(endpoint, error, { authenticated, data, response: { status: response.status } });
        return Promise.reject(error);
      }
      return text
    }).catch(err => {
      logApiError(endpoint, err, { authenticated, data });
      throw err;
    });
};

export const CALL_API = Symbol('Call API');

export default store => next => action => {
  const callAPI = action[CALL_API];
  // So the middleware doesn't get applied to every single action
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint, types, authenticated, data } = callAPI;

  const [requestType, successType, errorType] = types;

  // Dispatch request action
  next({ type: requestType });

  // Passing the authenticated boolean back in our data will let us distinguish between normal and secret quotes
  return callApi(endpoint, authenticated, data).then(
    response =>
      next({
        response,
        authenticated,
        type: successType,
        data
      }),
    error => {
      const errorResponse = handleApiError(error, endpoint, data);
      return next({
        error: errorResponse.error.message,
        errorCode: errorResponse.error.code,
        type: errorType
      });
    }
  )
};
