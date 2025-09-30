import { api } from '../../middleware/localApi';

export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

export const updateProfile = (profileData) => {
  return {
    [api]: {
      endpoint: '/auth/profile',
      method: 'PUT',
      body: JSON.stringify(profileData),
      headers: { 'Content-Type': 'application/json' },
      types: [
        UPDATE_PROFILE_REQUEST,
        UPDATE_PROFILE_SUCCESS,
        UPDATE_PROFILE_FAILURE
      ],
      authenticated: true,
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

export const followUser = (profile, metadata) => {
  return {
    [api]: {
      endpoint: '/auth/profile',
      method: 'PUT',
      body: JSON.stringify(metadata),
      headers: { 'Content-Type': 'application/json' },
      types: [
        UPDATE_PROFILE_REQUEST,
        UPDATE_PROFILE_SUCCESS,
        UPDATE_PROFILE_FAILURE
      ],
      authenticated: true,
    }
  }
};
