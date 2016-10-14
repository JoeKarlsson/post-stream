import { CALL_AUTH0_API } from '../../middleware/auth0api';

export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';

export const getUserProfile = (userId) => {
  return {
    [CALL_AUTH0_API]: {
      endpoint: `/users/${userId}`,
      authenticated: true,
      readOnly: true,
      types: [GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE],
    }
  }
};
