// import {
//   LOCK_SUCCESS
// } from '../actions/auth/loginActions'
// import {
//   LOGOUT_SUCCESS
// } from '../actions/auth/logoutActions'
// import { isTokenExpired } from '../components/shared/auth/jwtHelper';
// import { Map } from 'immutable';

// // Checks if there is a saved token and it's still valid
// const token = localStorage.getItem('id_token');
// const isTokenValid = !!token && !isTokenExpired(token);

// const initialState = Map({
//   isFetching: false,
//   isAuthenticated: isTokenValid
// });

// function auth(state = initialState, action) {
//   switch (action.type) {
//     case LOCK_SUCCESS:
//       return state.set('isFetching', false)
//         .set('isAuthenticated', true)
//         .set('errorMessage', '')

//     case LOGOUT_SUCCESS:
//       return state.set('isFetching', true)
//         .set('isAuthenticated', false)

//     default:
//       return state
//     }
// }

// export default auth;
