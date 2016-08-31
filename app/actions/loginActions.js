export const onUsernameChange = (username) => {
  return {
    type: 'HANDLE_USERNAME_CHANGE',
    username,
  }
};

export const onPasswordChange = (password) => {
  return {
    type: 'HANDLE_PASSWORD_CHANGE',
    password,
  }
};

const requestLogin = () => {
  return {
    type: "REQUEST_LOGIN",
  }
};

const receiveLogin = (json) => {
  return {
    type: "RECEIVE_LOGIN",
    login: json,
    receivedAt: Date.now()
  }
};

export const fetchLogin = () => {
  const state = getState();
  const username = state.rootReducer.authReducer.username;
  const password = state.rootReducer.authReducer.password;

  return dispatch => {
    dispatch(requestLogin());
    let myHeaders = new Headers();
    myHeaders.append(
      "Content-Type", 'application/x-www-form-urlencoded'
    );
    return fetch(`/api/login`, {
      method: 'POST',
      headers: myHeaders,
      body: `username=${username}&password=${password}`
    })
    .then(response => response.json())
    .then(json => dispatch(receiveLogin(json)));
  }
};

// export const submitNewPost = (body) => {
//   return dispatch => {
//     dispatch(requestNewPost());
//     let myHeaders = new Headers();
//     myHeaders.append(
//       "Content-Type", 'application/x-www-form-urlencoded'
//     );
//     return fetch(`/post/new`, {
//       method: 'POST',
//       headers: myHeaders,
//       body: `body=${body}`
//     })
//     .then(response => response.json())
//     .then(json => dispatch(receiveNewPost(json)));
//   }
// };


// const shouldFetchLogin = (state) => {
//   const posts = state.rootReducer.postReducer.posts;
//   if (!posts) {
//     return true;
//   } else if (posts.isFetching) {
//     return false;
//   } else {
//     return posts.didInvalidate;
//   }
// };

// export const fetchLoginIfNeeded = () => {
//   return (dispatch, getState) => {
//     if (shouldFetchPosts(getState())) {
//       return dispatch(fetchPosts());
//     }
//   }
// };
