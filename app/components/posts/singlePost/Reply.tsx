import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleReplyMode, updateReplyBody, createReply } from "../../../slices/postSlice";
import { AppDispatch, RootState } from "../../../slices";
import TextButton from "../../shared/textButton/TextButton";
import { MAX_POST_LENGTH } from "../../../slices/postSlice";
import styles from "../newPost/NewPost.module.scss";

const Reply = ({ index, id }: { index: number; id: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((state: RootState) => state.post.posts[index]);
  const fieldId = `reply-${id}`;

  if (!post?.replyMode) {
    return <TextButton onClick={() => dispatch(toggleReplyMode(index))}>reply</TextButton>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (post.replyBody?.trim()) {
      dispatch(createReply({ postId: id, body: post.replyBody }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor={fieldId}>reply</label>
      <textarea
        maxLength={MAX_POST_LENGTH}
        id={fieldId}
        rows={3}
        placeholder="say something nice..."
        value={post.replyBody}
        onChange={(e) => dispatch(updateReplyBody({ index, body: e.target.value }))}
      />
      <TextButton type="submit">reply</TextButton>
      <TextButton onClick={() => dispatch(toggleReplyMode(index))}>cancel</TextButton>
    </form>
  );
};

export default Reply;
