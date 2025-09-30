import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
} from "../actions/user/userActions";

import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  PROFILE_SUCCESS,
  PROFILE_FAILURE,
} from "../actions/auth/localAuthActions";
import { LOGOUT_SUCCESS } from "../actions/auth/logoutActions";

import { Map, List, fromJS } from "immutable";
import { UserState, AppAction } from "../types";

const initialState: Map<string, any> = Map({
  profile: Map(),
  isFetchingPosts: false,
  isFetching: false,
  didInvalidate: false,
  posts: List(),
  isAuthenticated: false,
  errorMessage: "",
  errorCode: null,
});

function user(
  state: Map<string, any> = initialState,
  action: AppAction
): Map<string, any> {
  switch (action.type) {
    case GET_USER_REQUEST:
      return state;

    case GET_USER_SUCCESS: {
      const parsedProfile =
        typeof action.response === "string"
          ? JSON.parse(action.response)
          : action.response;
      return state
        .set("isFetching", false)
        .set("isAuthenticated", true)
        .set("errorMessage", "")
        .set("errorCode", null)
        .set("profile", fromJS(parsedProfile));
    }

    case GET_USER_FAILURE:
      return state;

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case PROFILE_SUCCESS:
      return state
        .set("isFetching", false)
        .set("isAuthenticated", true)
        .set("errorMessage", "")
        .set("errorCode", null)
        .set("profile", fromJS(action.response.user || action.response));

    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case PROFILE_FAILURE:
      return state
        .set("isFetching", false)
        .set("isAuthenticated", false)
        .set("errorMessage", action.error)
        .set("errorCode", action.errorCode);

    case LOGOUT_SUCCESS:
      return state
        .set("isAuthenticated", false)
        .set("profile", Map())
        .set("errorMessage", "")
        .set("errorCode", null);

    case "CLEAR_ERROR":
      return state.set("errorMessage", "").set("errorCode", null);

    default:
      return state;
  }
}

export default user;
