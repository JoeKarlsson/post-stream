import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePost, updatePostBody, toggleEditMode } from "../../../slices/postSlice";
import { AppDispatch, RootState } from "../../../slices";
import TextButton from "../../shared/textButton/TextButton";
import { MAX_POST_LENGTH } from "../../../slices/postSlice";
import styles from "../newPost/NewPost.module.scss";

const EditPost = ({ id, index }: { id: number; index: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const body = useSelector((state: RootState) => state.post.posts[index]?.updatedPostBody);
  const fieldId = `edit-${id}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updatePost({ id, body: body ?? "" }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor={fieldId}>edit your post</label>
      <textarea
        maxLength={MAX_POST_LENGTH}
        id={fieldId}
        rows={5}
        value={body}
        onChange={(e) => dispatch(updatePostBody({ index, body: e.target.value }))}
      />
      <TextButton type="submit">save</TextButton>
      <TextButton onClick={() => dispatch(toggleEditMode({ index, editState: false }))}>
        cancel
      </TextButton>
    </form>
  );
};

export default EditPost;
