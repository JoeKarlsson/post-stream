import {
  LOCK_SUCCESS
} from '../actions/auth/loginActions'
import {
  LOGOUT_SUCCESS
} from '../actions/auth/logoutActions'
import { isTokenExpired } from '../components/shared/auth/jwtHelper';

// Checks if there is a saved token and it's still valid
const token = localStorage.getItem('id_token');
const isTokenValid = !!token && !isTokenExpired(token);

// The auth reducer. The starting state sets authentication
// based on a token being in local storage.
function auth(state = {
    isFetching: false,
    isAuthenticated: isTokenValid
  }, action) {
  switch (action.type) {
    case LOCK_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        errorMessage: ''
      })
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false
      })
    default:
      return state
    }
}

export default auth;
