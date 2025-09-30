import { api } from "../../middleware/localApi";

export const PROFILE_REQUEST = "PROFILE_REQUEST";
export const PROFILE_SUCCESS = "PROFILE_SUCCESS";
export const PROFILE_FAILURE = "PROFILE_FAILURE";

export const fetchUserPosts = (userName) => {
  return {
    [api]: {
      endpoint: `/post/user/${userName}`,
      method: "GET",
      types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
    },
  };
};
