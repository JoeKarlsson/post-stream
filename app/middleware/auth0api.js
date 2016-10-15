/*
  eslint
  no-unused-vars: 0
  no-undef: 0
*/

const setProfile = (profile) => {
  // Saves profile data to localStorage
  localStorage.setItem('profile', JSON.stringify(profile));
};

function callApi(
  endpoint,
  authenticated=false,
  data={},
  readOnly=false,
  ) {
  const BASE_URL = `https://${__AUTH0_DOMAIN__}/api/v2`;
  const {method, body, headers} = data;
  let token;
  let config = {};

  if(readOnly){
    token = __AUTH0_TOKEN__ || {};
  } else {
    token = localStorage.getItem('id_token') || {};
  }

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

  return fetch(BASE_URL + endpoint, config)
    .then(response =>
      response.text()
      .then(text => ({ text, response }))
    ).then(({ text, response }) => {
      if (!response.ok) {
        return Promise.reject(text);
      }
      if(!readOnly){
        const profile = JSON.parse(text);
        setProfile(profile);
      }

      return text
    }).catch(err => console.log(err));
};

export const CALL_AUTH0_API = Symbol('Call Auth0 API');

export default store => next => action => {
  const callAuth0API = action[CALL_AUTH0_API];
  // So the middleware doesn't get applied to every single action
  if (typeof callAuth0API === 'undefined') {
    return next(action);
  }

  let { endpoint, types, authenticated, data, readOnly } = callAuth0API;

  const [ requestType, successType, errorType ] = types;

  // Passing the authenticated boolean back in our data will let us distinguish between normal and secret quotes
  return callApi(endpoint, authenticated, data, readOnly).then(
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
