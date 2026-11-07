import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { createPost, setNewPostBody } from "../../../slices/postSlice";
import { AppDispatch, RootState } from "../../../slices";
import TextButton from "../../shared/textButton/TextButton";
import { MAX_POST_LENGTH } from "../../../slices/postSlice";
import styles from "./NewPost.module.scss";

const NewPost = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { newPostBody, submittingNewPost } = useSelector((state: RootState) => state.post);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostBody.trim()) {
      dispatch(createPost({ body: newPostBody }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="new-post">create a new post</label>
      <textarea
        maxLength={MAX_POST_LENGTH}
        id="new-post"
        rows={5}
        placeholder="share it with the world..."
        value={newPostBody}
        onChange={(e) => dispatch(setNewPostBody(e.target.value))}
      />
      <TextButton type="submit" disabled={submittingNewPost}>post</TextButton>
    </form>
  );
};

export default NewPost;
