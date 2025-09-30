import { api } from '../../middleware/localApi';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const PROFILE_REQUEST = 'PROFILE_REQUEST';
export const PROFILE_SUCCESS = 'PROFILE_SUCCESS';
export const PROFILE_FAILURE = 'PROFILE_FAILURE';

// Login action
export function login(email, password) {
  return {
    [api]: {
      endpoint: '/auth/login',
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE]
    }
  };
}

// Register action
export function register(userData) {
  return {
    [api]: {
      endpoint: '/auth/register',
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' },
      types: [REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE]
    }
  };
}

// Logout action
export function logout() {
  return dispatch => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: LOGOUT_SUCCESS });
  };
}

// Get profile action
export function getProfile() {
  return {
    [api]: {
      endpoint: '/auth/profile',
      method: 'GET',
      types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
      authenticated: true
    }
  };
}

// Update profile action
export function updateProfile(profileData) {
  return {
    [api]: {
      endpoint: '/auth/profile',
      method: 'PUT',
      body: JSON.stringify(profileData),
      headers: { 'Content-Type': 'application/json' },
      types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
      authenticated: true
    }
  };
}

// Change password action
export function changePassword(currentPassword, newPassword) {
  return {
    [api]: {
      endpoint: '/auth/change-password',
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
      headers: { 'Content-Type': 'application/json' },
      types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
      authenticated: true
    }
  };
}
