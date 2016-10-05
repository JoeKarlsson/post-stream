import { CALL_API } from '../../components/middleware/api'

export const EDIT_POST_REQUEST = 'EDIT_POST_REQUEST'
export const EDIT_POST_SUCCESS = 'EDIT_POST_SUCCESS'
export const EDIT_POST_FAILURE = 'EDIT_POST_FAILURE'
export const HANDLE_UPDATED_POST_BODY_CHANGE = 'HANDLE_UPDATED_POST_BODY_CHANGE'

// Uses the API middlware to edit a post
export function submitUpdatedPost(body, postId, index) {
  const data = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `body=${body}`,
    index,
  };

  return {
    [CALL_API]: {
      endpoint: `/post/${postId}/edit`,
      authenticated: true,
      types: [EDIT_POST_REQUEST, EDIT_POST_SUCCESS, EDIT_POST_FAILURE],
      data,
    }
  }
};

export const toggleEditMode = (index, editState) => {
  return {
    type: 'TOGGLE_EDIT_MODE',
    index,
    editState,
  }
};

export const handleUpdatedPostBodyChange = (body, index) => {
  return {
    type: 'HANDLE_UPDATED_POST_BODY_CHANGE',
    body,
    index,
  }
};

// export const submitUpdatedPost = (body, postId, index) => {
//   return dispatch => {
//     dispatch(requestUpdatedPost(index));
//     let myHeaders = new Headers();
//     myHeaders.append(
//       'Content-Type', 'application/x-www-form-urlencoded'
//     );
//     return fetch(`/post/${postId}/edit`, {
//       method: 'PUT',
//       headers: myHeaders,
//       body: `body=${body}`
//     })
//     .then(response => response.json())
//     .then(json => dispatch(receiveUpdatedPost(json, index)));
//   }
// };
