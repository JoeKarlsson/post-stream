import { CALL_API } from '../../middleware/api';

export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';

export const getUserProfile = (userId) => {

  return {
    [CALL_API]: {
      endpoint: `/users/${userId}`,
      authenticated: true,
      types: [
        GET_USER_REQUEST,
        GET_USER_SUCCESS,
        GET_USER_FAILURE
      ],
      auth0: {
        call: true,
        readOnly: true,
      },
    }
  }
};
