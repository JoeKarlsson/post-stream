import { CALL_API } from '../../components/middleware/api';

export const REPLY_REQUEST = 'REPLY_REQUEST';
export const REPLY_SUCCESS = 'REPLY_SUCCESS';
export const REPLY_FAILURE = 'REPLY_FAILURE';

export const submitNewReply = (info) => {
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `body=${info.replyBody}&userID=${info.userID}`,
    ...info
  };

  return {
    [CALL_API]: {
      endpoint: `/post/${info.id}/comments/${info.commentId}/new`,
      authenticated: true,
      types: [REPLY_REQUEST, REPLY_SUCCESS, REPLY_FAILURE],
      data,
    }
  }
};

export const onToggleReplyMode = (index) => {
  return {
    type: 'TOGGLE_REPLY_MODE',
    index,
  }
};

export const handleReplyBodyChange = (body, index) => {
  return {
    type: 'HANDLE_REPLY_BODY_CHANGE',
    index,
    body,
  }
};
