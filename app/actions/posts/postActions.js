import { CALL_API } from '../../middleware/api';

export const POST_REQUEST = 'POST_REQUEST';
export const POST_SUCCESS = 'POST_SUCCESS';
export const POST_FAILURE = 'POST_FAILURE';

export const fetchPosts = () => {
  const data = {
    method: 'GET',
    headers: {
      'Content-Type': 'content-type: application/json; charset=utf-8',
      'access-control-allow-origin': '*',
    },
  };
  return {
    [CALL_API]: {
      endpoint: '/post',
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      data,
    }
  }
};
