import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Remarkable } from "remarkable";
import twemoji from "twemoji";
import {
  fetchComments,
  toggleShowComment,
  toggleEditMode,
} from "../../../slices/postSlice";
import { RootState } from "../../../slices";
import CommentCount from "./CommentCount";
import DestroyPostButton from "./DestroyPostButton";
import Reply from "./Reply";
import EditPost from "./../editPost/EditPost";
import styles from "./Post.module.scss";

const COLORS = [
  "teal",
  "red",
  "purple",
  "orange",
  "pink",
  "lightGreen",
  "forrestGreen",
];

const renderMarkup = (body: string) => {
  const html = new Remarkable().render(body.toString());
  return { __html: twemoji.parse(html, { folder: "svg", ext: ".svg" }) };
};

interface PostProps {
  username: string;
  realName: string;
  commentCount: number;
  id: number;
  index: number;
  createdAt: string;
  body: string;
}

const Post: React.FC<PostProps> = ({
  username,
  realName,
  commentCount,
  id,
  index,
  createdAt,
  body,
}) => {
  const dispatch = useDispatch();
  const currentPost = useSelector((state: RootState) => state.post.posts[index]);
  const { isAuthenticated, profile } = useSelector(
    (state: RootState) => state.user
  );

  const markup = useMemo(() => renderMarkup(body), [body]);
  // Stable per post so colors don't shuffle on re-render
  const color = COLORS[id % COLORS.length];

  if (!currentPost) {
    return null;
  }

  const { editMode, showComments, comments } = currentPost;
  const isOwner = isAuthenticated && profile?.username === username;

  const handleCommentCountClick = () => {
    if (showComments) {
      dispatch(toggleShowComment({ index, showCommentState: false }));
    } else {
      dispatch(fetchComments(id));
    }
  };

  return (
    <div className={styles.post}>
      {editMode ? (
        <EditPost id={id} index={index} />
      ) : (
        <div>
          <div className={styles.statusBar}>
            [
            <Link to={`/user/${username}`} className={styles.username}>
              {" "}
              {realName}{" "}
            </Link>
            ] |{" "}
            <span className={styles.timeStamp}>
              {new Date(createdAt).toLocaleTimeString()}
            </span>
          </div>

          <span className={styles[color]} dangerouslySetInnerHTML={markup} />

          {isOwner && (
            <div>
              [{" "}
              <span
                className={styles.editButton}
                onClick={() =>
                  dispatch(toggleEditMode({ index, editState: true }))
                }
              >
                edit
              </span>{" "}
              ]
              <DestroyPostButton id={id} />
            </div>
          )}
          {isAuthenticated && <Reply id={id} index={index} />}
          <div
            className="comment-count"
            onClick={handleCommentCountClick}
            style={{ cursor: "pointer" }}
          >
            <CommentCount numOfComments={commentCount} />
          </div>
        </div>
      )}

      {showComments && (
        <div className="replies">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.statusBar}>
                  [
                  <Link
                    to={`/user/${comment.userID}`}
                    className={styles.username}
                  >
                    {" "}
                    {comment.userID}{" "}
                  </Link>
                  ] |{" "}
                  <span className={styles.timeStamp}>
                    {new Date(comment.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <span
                  className={styles[COLORS[comment.id % COLORS.length]]}
                  dangerouslySetInnerHTML={renderMarkup(comment.body)}
                />
              </div>
            ))
          ) : (
            <div>No comments yet.</div>
          )}
        </div>
      )}

      <hr />
    </div>
  );
};

Post.propTypes = {
  id: PropTypes.number,
  realName: PropTypes.string,
  username: PropTypes.string,
  body: PropTypes.string,
  createdAt: PropTypes.string,
  commentCount: PropTypes.number,
  index: PropTypes.number,
};

export default Post;
