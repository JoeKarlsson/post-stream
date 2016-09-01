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