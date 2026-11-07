import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleReplyMode, updateReply, createReply } from "../../../slices/postSlice";
import { AppDispatch, RootState } from "../../../slices";
import {
  RESPONSES,
  MAX_DETAIL_LENGTH,
  findResponse,
} from "../../../../shared/contextualResponses.mjs";
import TextButton from "../../shared/textButton/TextButton";
import styles from "./Reply.module.scss";

// Replies are contextual responses picked from a list, not free-form text
const Reply = ({ index, id }: { index: number; id: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((state: RootState) => state.post.posts[index]);

  if (!post?.replyMode) {
    return <TextButton onClick={() => dispatch(toggleReplyMode(index))}>reply</TextButton>;
  }

  const chosen = findResponse(post.replyKind);
  const detailId = `reply-${id}-detail`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chosen && (!chosen.detail || post.replyDetail.trim())) {
      dispatch(createReply({ postId: id, kind: chosen.kind, detail: post.replyDetail }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reply}>
      <fieldset>
        <legend>reply with</legend>
        {RESPONSES.map((response) => (
          <label key={response.kind} className={styles.choice}>
            <input
              type="radio"
              name={`reply-${id}`}
              value={response.kind}
              checked={post.replyKind === response.kind}
              onChange={() => dispatch(updateReply({ index, kind: response.kind }))}
            />{" "}
            {response.label}
            {response.detail && " ..."}
          </label>
        ))}
      </fieldset>

      {chosen?.detail && (
        <>
          <label htmlFor={detailId}>{`${chosen.label} ...`}</label>
          <input
            id={detailId}
            type="text"
            required
            maxLength={MAX_DETAIL_LENGTH}
            placeholder={chosen.detail}
            value={post.replyDetail}
            onChange={(e) => dispatch(updateReply({ index, detail: e.target.value }))}
          />
        </>
      )}

      <TextButton type="submit" disabled={!chosen}>
        send reply
      </TextButton>
      <TextButton onClick={() => dispatch(toggleReplyMode(index))}>cancel</TextButton>
    </form>
  );
};

export default Reply;
