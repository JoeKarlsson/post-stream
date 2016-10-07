import { CALL_API } from '../../components/middleware/api';

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
      auth: true,
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

// export const updateProfile = (userId, data) => {
//   let token = localStorage.getItem('id_token');
//   const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`,
//   };
//   // making the PATCH http request to auth0 api
//   return fetch(`https://${__AUTH0_DOMAIN__}/api/v2/users/${userId}`, {
//     method: 'PATCH',
//     headers: headers,
//     body: JSON.stringify(data)
//   })
//   .then(response => response.json())
//   .then(newProfile => setProfile(newProfile)) //updating current profile
// };
