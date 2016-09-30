/*
  eslint no-undef: 0
*/

import Auth0Lock from 'auth0-lock';
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
    __AUTH0_DOMAIN__, {
      auth: { redirect: false }
    }
  );
  lock.show()
  return dispatch => {
    lock.on("authenticated", function(authResult) {
      // Saves the user token
      // this.setToken(authResult.idToken)
      // Async loads the user profile data
      lock.getProfile(authResult.idToken, function(error, profile) {

        if (error) {
          // handle error
          return dispatch(lockError(error))
        }

        localStorage.setItem('profile', JSON.stringify(profile))
        localStorage.setItem('id_token', authResult.idToken)
        return dispatch(lockSuccess(profile))
      });
    });
  }
}
