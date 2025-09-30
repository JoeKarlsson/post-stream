import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createPost, setNewPostBody } from "../../../slices/postSlice";
import { RootState } from "../../../slices";
import styles from "./NewPost.module.scss";

const NewPostForm = () => {
  const dispatch = useDispatch();
  const bodyRef = useRef();
  const newPostBody = useSelector((state: RootState) => state.post.newPostBody);
  const user = useSelector((state: RootState) => state.user.profile);

  const handleBodyChange = (e) => {
    dispatch(setNewPostBody(e.target.value));
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (user && newPostBody.trim()) {
      dispatch(
        createPost({
          body: newPostBody,
          user_id: user.id,
          name: user.user_metadata?.name || user.nickname || "Anonymous",
        })
      );
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSubmitPost(event);
    }
  };

  return (
    <div className={styles.u_full_width}>
      <form>
        <label htmlFor="body" className={styles.bodyLabel}>
          create a new post
        </label>
        <textarea
          ref={bodyRef}
          type="textarea"
          id="body"
          rows="5"
          className="u-full-width"
          placeholder="share it with the world..."
          value={newPostBody}
          onChange={handleBodyChange}
        ></textarea>
        <div>
          [
          <span
            className={styles.clickable}
            onClick={handleSubmitPost}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
          >
            {" "}
            post{" "}
          </span>
          ]
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;
