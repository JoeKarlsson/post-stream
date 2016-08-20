import React from 'react';

const CommentCount = (props) => {
  let textToDisplay;

  if (props.numOfComments === 0) {
    textToDisplay = `[ No Comments ]`;
  } else if (props.numOfComments === 1) {
    textToDisplay = `[ ${props.numOfComments} Comment ]`;
  } else {
    textToDisplay = `[ ${props.numOfComments} Comments ]`;
  }

  return (
    <span>
      <button>{textToDisplay}</button>
    </span>
  );
};

export default CommentCount;
