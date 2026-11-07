import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deletePost,
  fetchComments,
  toggleShowComment,
  toggleEditMode,
} from "../../../slices/postSlice";
import { AppDispatch, RootState } from "../../../slices";
import { Post as PostType } from "../../../types";
import { renderPostHtml } from "../../../utils/markdown";
import { authorColor } from "../../../utils/authorColor";
import TextButton from "../../shared/textButton/TextButton";
import CommentCount from "./CommentCount";
import Reply from "./Reply";
import EditPost from "./../editPost/EditPost";
import styles from "./Post.module.scss";

const renderMarkup = (body: string) => ({ __html: renderPostHtml(body) });

type PostProps = Pick<PostType, "id" | "body" | "userID" | "createdAt" | "commentCount"> & {
  index: number;
};

const Post = ({ id, body, userID, createdAt, commentCount = 0, index }: PostProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentPost = useSelector((state: RootState) => state.post.posts[index]);
  const { isAuthenticated, profile } = useSelector(
    (state: RootState) => state.user
  );

  const markup = useMemo(() => renderMarkup(body), [body]);

  if (!currentPost) {
    return null;
  }

  const { editMode, showComments, comments } = currentPost;
  const isOwner = isAuthenticated && profile?.username === userID;

  const handleCommentCountClick = () => {
    if (showComments) {
      dispatch(toggleShowComment({ index, showCommentState: false }));
    } else {
      dispatch(fetchComments(id));
    }
  };

  return (
    <article>
      {editMode ? (
        <EditPost id={id} index={index} />
      ) : (
        <div>
          <div className={styles.statusBar}>
            [{" "}
            <Link to={`/user/${userID}`} className={styles.username}>
              {userID}
            </Link>{" "}
            ] |{" "}
            <span className={styles.timeStamp}>
              {new Date(createdAt).toLocaleTimeString()}
            </span>
          </div>

          <div
            className={`${styles.body} ${styles[authorColor(userID)]}`}
            dangerouslySetInnerHTML={markup}
          />

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
              <div key={comment.id} className={styles.comment}>
                <div className={styles.statusBar}>
                  [{" "}
                  <Link to={`/user/${comment.userID}`} className={styles.username}>
                    {comment.userID}
                  </Link>{" "}
                  ] |{" "}
                  <span className={styles.timeStamp}>
                    {new Date(comment.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div
                  className={`${styles.commentBody} ${styles[authorColor(comment.userID)]}`}
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
