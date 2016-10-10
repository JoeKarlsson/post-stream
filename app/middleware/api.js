/*
  eslint
  no-unused-vars: 0
  no-undef: 0
*/

const setProfile = (profile) => {
  // Saves profile data to localStorage
  localStorage.setItem('profile', JSON.stringify(profile));
};

function callApi(endpoint, authenticated=false, data={}, auth={auth0: {
        call: false,
        readOnly: false,
      }}) {
  let BASE_URL = 'http://localhost:3000';
  let token;
  if(auth.auth0.readOnly){
    token = __AUTH0_TOKEN__ || {};
  } else {
    token = localStorage.getItem('id_token') || {};
  }
  let config = {};
  const {method, body, headers} = data;

  if(auth.auth0.call){
    BASE_URL = `https://${__AUTH0_DOMAIN__}/api/v2`;
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
      if(auth){
        const profile = JSON.parse(text);
        setProfile(profile);
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

  let { endpoint, types, authenticated, data, auth } = callAPI;

  const [ requestType, successType, errorType ] = types;

  // Passing the authenticated boolean back in our data will let us distinguish between normal and secret quotes
  return callApi(endpoint, authenticated, data, auth).then(
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
