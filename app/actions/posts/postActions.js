// The middleware to call the API for quotes
import { CALL_API } from '../../components/middleware/api';

export const POST_REQUEST = 'POST_REQUEST';
export const POST_SUCCESS = 'POST_SUCCESS';
export const POST_FAILURE = 'POST_FAILURE';

// Uses the API middlware to get all of the posts
export const fetchPosts = () => {
  return {
    [CALL_API]: {
      endpoint: '/post',
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
    }
  }
};
