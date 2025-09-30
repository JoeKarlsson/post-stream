import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  submitNewPost,
  handleNewPostBodyChange
} from '../../../actions/posts/newPostActions';
import styles from './NewPost.module.scss';

const NewPostForm = () => {
  const dispatch = useDispatch();
  const bodyRef = useRef();
  const newPostBody = useSelector(state => state.root.post.get('newPostBody'));

  const handleBodyChange = (e) => {
    dispatch(handleNewPostBodyChange(e.target.value));
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile');
    dispatch(submitNewPost(newPostBody, profile.user_id));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSubmitPost(event);
    }
  };

  return (
    <div className={styles.u_full_width}>
      <form>
        <label htmlFor="body" className={styles.bodyLabel}>create a new post</label>
        <textarea
          ref={bodyRef}
          type='textarea'
          id='body'
          rows='5'
          className="u-full-width"
          placeholder='share it with the world...'
          value={newPostBody}
          onChange={handleBodyChange}
        ></textarea>
        <div>
          [<span className={styles.clickable} onClick={handleSubmitPost} onKeyDown={handleKeyDown} tabIndex={0} role="button"> post </span>]
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;
