import { CALL_API } from '../../middleware/api';

export const DESTROY_POST_REQUEST = 'DESTROY_POST_REQUEST';
export const DESTROY_POST_SUCCESS = 'DESTROY_POST_SUCCESS';
export const DESTROY_POST_FAILURE = 'DESTROY_POST_FAILURE';

export const destroyPost = (postId, index) => {
  const data = {
    method: 'DELETE',
    index,
  };

  return {
    [CALL_API]: {
      endpoint: `/post/${postId}`,
      authenticated: true,
      types: [
        DESTROY_POST_REQUEST,
        DESTROY_POST_SUCCESS,
        DESTROY_POST_FAILURE,
      ],
      data,
    }
  }
};
