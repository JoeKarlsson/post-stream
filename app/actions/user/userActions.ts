import { api } from "../../middleware/localApi";
import { ApiMiddlewareAction } from "../../types";

export const GET_USER_REQUEST = "GET_USER_REQUEST";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";
export const GET_USER_FAILURE = "GET_USER_FAILURE";

export const getUserProfile = (username: string): ApiMiddlewareAction => {
  return {
    [api]: {
      endpoint: `/auth/user/${username}`,
      method: "GET",
      types: [GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE],
    },
  };
};
