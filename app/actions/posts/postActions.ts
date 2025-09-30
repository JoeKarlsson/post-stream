import { api } from '../../middleware/localApi';

export const POST_REQUEST = 'POST_REQUEST';
export const POST_SUCCESS = 'POST_SUCCESS';
export const POST_FAILURE = 'POST_FAILURE';

export const fetchPosts = () => {
  return {
    [api]: {
      endpoint: '/post',
      method: 'GET',
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
    }
  }
};
