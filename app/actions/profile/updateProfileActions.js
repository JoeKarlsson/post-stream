import { CALL_API } from '../../middleware/api';

export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

export const updateProfile = (userId, metadata) => {
  const data = {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  };

  return {
    [CALL_API]: {
      endpoint: `/users/${userId}`,
      authenticated: true,
      types: [
        UPDATE_PROFILE_REQUEST,
        UPDATE_PROFILE_SUCCESS,
        UPDATE_PROFILE_FAILURE
      ],
      data,
      auth0: {
        call: true,
        readOnly: false,
      },
    }
  }
};

export const onFormChange = (fieldName, content) => {
  return {
    type: 'HANDLE_FORM_CHANGE',
    fieldName,
    content,
  }
};

export const followUser = (profile, user_id) => {
  const metadata = {
    user_metadata: {
      following: user_id,
    }
  };
}