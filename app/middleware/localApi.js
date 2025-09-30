const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

function callApi(endpoint, method = 'GET', body = null, headers = {}, authenticated = false) {
  const url = API_BASE_URL + endpoint;
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body) {
    config.body = body;
  }

  if (authenticated) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      return Promise.reject(new Error('No authentication token found'));
    }
  }

  return fetch(url, config)
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }
      return response.json();
    })
    .catch(error => {
      console.error('API call failed:', error);
      throw error;
    });
}

export const api = Symbol('Call API');

export default store => next => action => {
  const callAPI = action[api];
  
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint, method, body, headers, authenticated, types } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }

  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const [requestType, successType, failureType] = types;

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[api];
    return finalAction;
  }

  next(actionWith({ type: requestType }));

  return callApi(endpoint, method, body, headers, authenticated).then(
    response => {
      // Handle successful login/register
      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return next(actionWith({
        response,
        type: successType
      }));
    },
    error => {
      // Handle authentication errors
      if (error.error && (error.error.includes('token') || error.error.includes('unauthorized'))) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      return next(actionWith({
        type: failureType,
        error: error.error || 'Something bad happened'
      }));
    }
  );
};
