import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { deletePost } from '../../../slices/postSlice';
import styles from './DestroyPostButton.module.scss';

const DestroyPostButton = ({ id }) => {
  const dispatch = useDispatch();

  const handleDeletingPost = () => {
    dispatch(deletePost(id));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDeletingPost();
    }
  };

  return (
    <div className={styles.destroyPost}>
      [ <span
        className={styles.destroyButton}
        onClick={handleDeletingPost}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
      >destroy</span> ]
    </div>
  );
};

DestroyPostButton.propTypes = {
  id: PropTypes.number,
};

export default DestroyPostButton;
