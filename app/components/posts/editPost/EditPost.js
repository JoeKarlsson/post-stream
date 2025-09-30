import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  submitUpdatedPost,
  handleUpdatedPostBodyChange,
  toggleEditMode,
} from '../../../actions/posts/editPostActions';
import styles from './EditPost.module.scss';

const EditPost = ({ id, index }) => {
  const dispatch = useDispatch();
  const bodyRef = useRef();

  const updatedPostBody = useSelector(state =>
    state.root.post.get('posts').get(index).get('updatedPostBody')
  );

  const handleCancel = () => {
    dispatch(toggleEditMode(index, false));
  };

  const handleBodyChange = (e) => {
    dispatch(handleUpdatedPostBodyChange(e.target.value, index));
  };

  const handleSubmitUpdatedPost = (e) => {
    e.preventDefault();
    dispatch(submitUpdatedPost(updatedPostBody, id, index));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSubmitUpdatedPost(event);
    }
  };

  const handleCancelKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCancel();
    }
  };

  return (
    <div className={styles.editPost} >
      <form>
        <textarea
          ref={bodyRef}
          type='text'
          id='body'
          rows='5'
          className='u-full-width'
          placeholder='edit your post'
          value={updatedPostBody}
          onChange={handleBodyChange}
        ></textarea>
        <div>
          [<span className={styles.saveButton} onClick={handleSubmitUpdatedPost} onKeyDown={handleKeyDown} tabIndex={0} role="button"> save </span> ]
        </div>
        <div>
          [ <span className={styles.cancelButton} onClick={handleCancel} onKeyDown={handleCancelKeyDown} tabIndex={0} role="button"> cancel </span> ]
        </div>
      </form>
    </div>
  );
};

EditPost.propTypes = {
  id: PropTypes.number,
  index: PropTypes.number,
};

export default EditPost;
