// The middleware to call the API for quotes
import { CALL_API } from '../../components/middleware/api'

export const DESTROY_POST_REQUEST = 'DESTROY_POST_REQUEST'
export const DESTROY_POST_SUCCESS = 'DESTROY_POST_SUCCESS'
export const DESTROY_POST_FAILURE = 'DESTROY_POST_FAILURE'

// Uses the API middlware to get a quote
export function destroyPost(postId, index) {
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
        DESTROY_POST_FAILURE
      ],
      data
    }
  }
}
