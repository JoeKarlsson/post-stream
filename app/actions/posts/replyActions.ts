import { CALL_API } from "../../middleware/api";
import {
  ToggleReplyModeAction,
  HandleReplyBodyChangeAction,
} from "../../types";

export const REPLY_REQUEST = "REPLY_REQUEST";
export const REPLY_SUCCESS = "REPLY_SUCCESS";
export const REPLY_FAILURE = "REPLY_FAILURE";

interface ReplyInfo {
  replyBody: string;
  userID: string;
  id: number;
  commentId: number;
  index: number;
}

export const submitNewReply = (info: ReplyInfo) => {
  const data = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `body=${info.replyBody}&userID=${info.userID}`,
    ...info,
  };

  return {
    [CALL_API]: {
      endpoint: `/post/${info.id}/comments/${info.commentId}/new`,
      authenticated: true,
      types: [REPLY_REQUEST, REPLY_SUCCESS, REPLY_FAILURE],
      data,
    },
  };
};

export const onToggleReplyMode = (index: number): ToggleReplyModeAction => {
  return {
    type: "TOGGLE_REPLY_MODE",
    index,
  };
};

export const handleReplyBodyChange = (
  body: string,
  index: number
): HandleReplyBodyChangeAction => {
  return {
    type: "HANDLE_REPLY_BODY_CHANGE",
    index,
    body,
  };
};
