import { CALL_API } from "../../middleware/api";
import { HandleNewPostBodyChangeAction } from "../../types";

export const NEW_POST_REQUEST = "NEW_POST_REQUEST";
export const NEW_POST_SUCCESS = "NEW_POST_SUCCESS";
export const NEW_POST_FAILURE = "NEW_POST_FAILURE";

interface Profile {
  user_id: string;
  name: string;
}

export const submitNewPost = (body: string) => {
  const profile: Profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const data = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `body=${body}&userID=${profile.user_id}`,
    name: profile.name,
    user_id: profile.user_id,
  };

  return {
    [CALL_API]: {
      endpoint: "/post/new",
      authenticated: true,
      types: [NEW_POST_REQUEST, NEW_POST_SUCCESS, NEW_POST_FAILURE],
      data,
    },
  };
};

export const handleNewPostBodyChange = (
  body: string
): HandleNewPostBodyChangeAction => {
  return {
    type: "HANDLE_NEW_POST_BODY_CHANGE",
    body: body,
  };
};
