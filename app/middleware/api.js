/*
  eslint
  no-unused-vars: 0
  no-undef: 0
*/

function callApi(endpoint, authenticated=false, data={}) {
  let token = localStorage.getItem('id_token') || {};

  let config = {};
  const {method, body, headers} = data;

  if (method){
    config.method = method;
  }
  if (body){
    config.body = body;
  }

  if(authenticated) {
    if(token) {
      config.headers = {
          'Authorization': `Bearer ${token}`,
          ...headers
        };
    } else {
      throw new Error("No token saved!");
    }
  }

  return fetch(endpoint, config)
    .then(response =>
      response.text()
      .then(text => ({ text, response }))
    ).then(({ text, response }) => {
      if (!response.ok) {
        return Promise.reject(text);
      }
      return text
    }).catch(err => console.log(err));
};

export const CALL_API = Symbol('Call API');

export default store => next => action => {
  const callAPI = action[CALL_API];
  // So the middleware doesn't get applied to every single action
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint, types, authenticated, data } = callAPI;

  const [ requestType, successType, errorType ] = types;

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
    error => next({
      error: error.message || 'There was an error.',
      type: errorType
    })
  )
};
