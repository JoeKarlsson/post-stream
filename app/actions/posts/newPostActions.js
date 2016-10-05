import { CALL_API } from '../../components/middleware/api';

export const NEW_POST_REQUEST = 'NEW_POST_REQUEST';
export const NEW_POST_SUCCESS = 'NEW_POST_SUCCESS';
export const NEW_POST_FAILURE = 'NEW_POST_FAILURE';

// Uses the API middlware to create a new post
export const submitNewPost = (body, userID) => {
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `body=${body}&userID=${userID}`,
  };

  return {
    [CALL_API]: {
      endpoint: '/post/new',
      authenticated: true,
      types: [NEW_POST_REQUEST, NEW_POST_SUCCESS, NEW_POST_FAILURE],
      data,
    }
  }
};

export const handleNewPostBodyChange = (body) => {
  return {
    type: 'HANDLE_NEW_POST_BODY_CHANGE',
    body: body,
  }
};
