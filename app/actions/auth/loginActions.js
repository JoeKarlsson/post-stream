/*
  eslint no-undef: 0
*/

// import Auth0Lock from 'auth0-lock';
// import AuthService from '../../components/shared/auth/AuthService'

// There are two possible states for our login
// process and we need actions for each of them.
//
// We also need one to show the Lock widget.
export const LOCK_SUCCESS = 'LOCK_SUCCESS'
export const LOCK_ERROR = 'LOCK_ERROR'

function lockSuccess(profile, token) {
  return {
    type: LOCK_SUCCESS,
    profile,
    token
  }
}

function lockError(err) {
  return {
    type: LOCK_ERROR,
    err
  }
}

// Opens the Lock widget and
// dispatches actions along the way
export function login() {
  const lock = new Auth0Lock(
    __AUTH0_CLIENT_ID__,
    __AUTH0_DOMAIN__
  );
  return dispatch => {
    lock.show((err, profile, token) => {
      if(err) {
        dispatch(lockError(err))
        return
      }
      localStorage.setItem('profile', JSON.stringify(profile))
      localStorage.setItem('id_token', token)
      dispatch(lockSuccess(profile, token))
    })
  }
}