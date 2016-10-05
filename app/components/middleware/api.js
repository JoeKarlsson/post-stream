const BASE_URL = 'http://localhost:3000'

function callApi(endpoint, authenticated, data={}) {

  let token = localStorage.getItem('id_token') || null
  let config = {};
  const {method, body, headers} = data
  if (method && body){
    config.method = method;
    config.body = body
  }

  if(authenticated) {
    if(token) {
      config.headers = {
          'Authorization': `Bearer ${token}`,
          ...headers
        }
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
        return Promise.reject(text)
      }

      return text
    }).catch(err => console.log(err))
}

export const CALL_API = Symbol('Call API')

export default store => next => action => {
  const callAPI = action[CALL_API]

  // So the middleware doesn't get applied to every single action
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint, types, authenticated, data } = callAPI

  const [ requestType, successType, errorType ] = types

  // Passing the authenticated boolean back in our data will let us distinguish between normal and secret quotes
  return callApi(endpoint, authenticated, data).then(
    response =>
      next({
        response,
        authenticated,
        type: successType
      }),
    error => next({
      error: error.message || 'There was an error.',
      type: errorType
    })
  )
}