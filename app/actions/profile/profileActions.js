import { CALL_API } from '../../middleware/api';

export const PROFILE_REQUEST = 'PROFILE_REQUEST';
export const PROFILE_SUCCESS = 'PROFILE_SUCCESS';
export const PROFILE_FAILURE = 'PROFILE_FAILURE';

export const fetchUserPosts = (userName) => {
  return {
    [CALL_API]: {
      endpoint: `/post/user/${userName}`,
      types: [
        PROFILE_REQUEST,
        PROFILE_SUCCESS,
        PROFILE_FAILURE
      ],
    }
  }
};
