import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  PREVIEW_LENGTH,
  deletePost,
  fetchComments,
  toggleExpanded,
  toggleShowComment,
  toggleEditMode,
} from "../../../slices/postSlice";
import { AppDispatch, RootState } from "../../../slices";
import { Post as PostType } from "../../../types";
import { renderPostHtml } from "../../../utils/markdown";
import { authorColor } from "../../../utils/authorColor";
import { formatTimestamp, previewText } from "../../../utils/plainText";
import TextButton from "../../shared/textButton/TextButton";
import CommentCount from "./CommentCount";
import Reply from "./Reply";
import EditPost from "./../editPost/EditPost";
import styles from "./Post.module.scss";
import colors from "../../shared/styles/authorColors.module.scss";

const renderMarkup = (body: string) => ({ __html: renderPostHtml(body) });

// An IRC-style log line: [2026-11-06 19:17] <janedoe343> (edited)
// The timestamp is the permalink, like an anchor in a log.
const LogLine = ({
  userID,
  createdAt,
  permalink,
  editedAt,
}: {
  userID: string;
  createdAt: string;
  permalink: string;
  editedAt?: string | null;
}) => (
  <div className={styles.logLine}>
    <Link to={permalink} className={styles.timeStamp}>
      <time dateTime={createdAt}>[{formatTimestamp(createdAt)}]</time>
    </Link>{" "}
    &lt;
    <Link to={`/user/${userID}`} className={`${styles.username} ${colors[authorColor(userID)]}`}>
      {userID}
    </Link>
    &gt;
    {editedAt && (
      <>
        {" "}
        <span title={`edited ${formatTimestamp(editedAt)}`}>(edited)</span>
      </>
    )}
  </div>
);

type PostProps = Pick<
  PostType,
  "id" | "body" | "userID" | "createdAt" | "commentCount" | "editedAt"
> & {
  index: number;
};

const Post = ({ id, body, userID, createdAt, editedAt, commentCount = 0, index }: PostProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentPost = useSelector((state: RootState) => state.post.posts[index]);
  const { isAuthenticated, profile } = useSelector(
    (state: RootState) => state.user
  );

  const expanded = currentPost?.expanded ?? false;
  const isLong = body.length > PREVIEW_LENGTH;
  // The stream shows the first 256 characters; "read more" shows the rest
  const markup = useMemo(
    () => renderMarkup(isLong && !expanded ? previewText(body, PREVIEW_LENGTH) : body),
    [body, isLong, expanded]
  );

  if (!currentPost) {
    return null;
  }

  const { editMode, showComments, comments } = currentPost;
  const permalink = `/p/${id}`;
  const isOwner = isAuthenticated && profile?.username === userID;

  const handleCommentCountClick = () => {
    if (showComments) {
      dispatch(toggleShowComment({ index, showCommentState: false }));
    } else {
      dispatch(fetchComments(id));
    }
  };

  return (
    // tabIndex -1: the j/k shortcuts move focus between posts
    <article tabIndex={-1} className={styles.post}>
      {editMode ? (
        <EditPost id={id} index={index} />
      ) : (
        <div>
          <LogLine userID={userID} createdAt={createdAt} permalink={permalink} editedAt={editedAt} />

          <div
            className={`${styles.body} ${colors[authorColor(userID)]}`}
            dangerouslySetInnerHTML={markup}
          />
          {isLong && (
            <TextButton onClick={() => dispatch(toggleExpanded(index))}>
              {expanded ? "show less" : "read more"}
            </TextButton>
          )}

          <div className={styles.actions}>
            {isOwner && (
              <>
                <TextButton onClick={() => dispatch(toggleEditMode({ index, editState: true }))}>
                  edit
                </TextButton>
                <TextButton onClick={() => dispatch(deletePost(id))}>destroy</TextButton>
              </>
            )}
            {isAuthenticated && <Reply id={id} index={index} />}
            <TextButton onClick={handleCommentCountClick}>
              <CommentCount numOfComments={commentCount} />
            </TextButton>
          </div>
        </div>
      )}

      {showComments && (
        <div className="replies">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} id={`c${comment.id}`} className={styles.comment}>
                <LogLine
                  userID={comment.userID}
                  createdAt={comment.createdAt}
                  permalink={`${permalink}#c${comment.id}`}
                />
                <div
                  className={`${styles.commentBody} ${colors[authorColor(comment.userID)]}`}
                  dangerouslySetInnerHTML={renderMarkup(comment.body)}
                />
              </div>
            ))
          ) : (
            <div>no comments yet</div>
          )}
        </div>
      )}

      <hr />
    </article>
  );
};

export default Post;
