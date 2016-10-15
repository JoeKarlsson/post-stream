import React from 'react';
import styles from './CommentCount.scss';

const CommentCount = (props) => {
  let textToDisplay;

  if (props.numOfComments === 0) {
    textToDisplay = `No Comments`;
  } else if (props.numOfComments === 1) {
    textToDisplay = `${props.numOfComments} Comment`;
  } else {
    textToDisplay = `${props.numOfComments} Comments`;
  }

  return (
    <span>
      [ <span className={ styles.commentCount }>{textToDisplay}</span> ]
    </span>
  );
};

export default CommentCount;
