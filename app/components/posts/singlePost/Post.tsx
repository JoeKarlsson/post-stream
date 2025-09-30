import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Remarkable } from "remarkable";
import twemoji from "twemoji";
import {
  toggleComment,
  fetchCommentsIfNeeded,
  toggleShowComment,
} from "../../../actions/posts/commentActions";
import { toggleEditMode } from "../../../actions/posts/editPostActions";
import CommentCount from "./CommentCount";
import DestroyPostButton from "./DestroyPostButton";
import Reply from "./Reply";
import EditPost from "./../editPost/EditPost";
import styles from "./Post.module.scss";
import { Comment, Post as PostType } from "../../../types";

interface PostProps {
  username: string | number;
  realName: string;
  commentCount: number;
  id: number;
  index: number;
  isParentPost: boolean;
  createdAt: string;
  body: string;
  comments: Comment[];
  auth: Record<string, unknown>;
}

const Post: React.FC<PostProps> = ({
  username,
  realName,
  commentCount,
  id,
  index,
  isParentPost,
  createdAt,
  body,
  comments,
  auth,
}) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const post = useSelector((state) => state.post);

  const currentPost = post.posts[index];

  // Safety check to ensure the post exists
  if (!currentPost) {
    return null;
  }

  const editMode = currentPost.editMode;
  const showComments = currentPost.showComments;
  const childId = currentPost.childId;
  const childContext = currentPost.childContext;
  const postUserID = currentPost.userID;
  const postComments = currentPost.comments;
  const isAuthenticated = profile.isAuthenticated;
  const profileData = profile.profile;

  const rawMarkup = useMemo(() => {
    const md = new Remarkable();
    const rawMarkup = md.render(body.toString());
    const output = twemoji.parse(rawMarkup, {
      folder: "svg",
      ext: ".svg",
    });
    return { __html: output };
  }, [body]);

  const getRandomColor = useMemo(() => {
    const colors = [
      "teal",
      "red",
      "purple",
      "orange",
      "pink",
      "lightGreen",
      "forrestGreen",
    ];

    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  }, [id]); // Use post ID as dependency to ensure consistent color per post

  const handleToggleComments = () => {
    dispatch(toggleShowComment(index, !showComments));
  };

  const handleEdit = () => {
    dispatch(toggleEditMode(index, !editMode));
  };

  const handleShowingChild = () => {
    console.log("🔍 handleShowingChild called:", { id, index, showComments });
    dispatch(fetchCommentsIfNeeded(id, index));
  };

  const handlePrev = () => {
    const newChildId = childId - 1;

    if (~newChildId) {
      dispatch(toggleComment(index, newChildId));
    }
  };

  const handleNext = () => {
    const newChildId = childId + 1;

    if (newChildId < postComments.length) {
      dispatch(toggleComment(index, newChildId));
    }
  };

  const color = getRandomColor;

  return (
    <div className={styles.post}>
      {editMode === false && isParentPost && (
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

          <span className={styles[color]} dangerouslySetInnerHTML={rawMarkup} />

          {isAuthenticated && postUserID === profileData.user_id && (
            <div>
              [{" "}
              <span className={styles.editButton} onClick={handleEdit}>
                edit
              </span>{" "}
              ]
              <DestroyPostButton id={id} index={index} />
            </div>
          )}
          {isAuthenticated && <Reply id={id} index={index} auth={auth} />}
          <div
            className="comment-count"
            onClick={handleShowingChild}
            style={{ cursor: "pointer", border: "1px solid red" }}
          >
            <CommentCount numOfComments={commentCount} />
          </div>
        </div>
      )}

      {!isParentPost && (
        <div>
          <span className={styles[color]} dangerouslySetInnerHTML={rawMarkup} />

          {!showComments && (
            <div
              className="comment-count"
              onClick={handleShowingChild}
              style={{ cursor: "pointer", border: "1px solid blue" }}
            ></div>
          )}

          {showComments && (
            <div
              className="comment-count"
              onClick={handleToggleComments}
              style={{ cursor: "pointer", border: "1px solid green" }}
            >
              <CommentCount numOfComments={commentCount} />
            </div>
          )}
        </div>
      )}

      {editMode === true && <EditPost id={id} index={index} />}

      {showComments && (
        <div className="replies">
          {postComments && postComments.length > 0 && (
            <>
              {postComments.map((comment, commentIndex) => (
                <Post
                  key={comment.id}
                  id={comment.id}
                  body={comment.body}
                  userID={comment.userID}
                  createdAt={comment.createdAt}
                  updatedAt={comment.updatedAt}
                  commentCount={comment.commentCount || 0}
                  username={comment.userID}
                  realName={`User ${comment.userID}`}
                  index={commentIndex}
                  isParentPost={false}
                  comments={[]}
                  auth={auth}
                />
              ))}
            </>
          )}

          {(!postComments || postComments.length === 0) && (
            <div>No comments yet.</div>
          )}
        </div>
      )}

      {isParentPost && <hr />}
    </div>
  );
};

Post.propTypes = {
  id: PropTypes.number,
  comments: PropTypes.arrayOf(PropTypes.object),
  showComments: PropTypes.bool,
  isParentPost: PropTypes.bool,
  realName: PropTypes.string,
  username: PropTypes.string,
  body: PropTypes.string,
  createdAt: PropTypes.number,
  commentCount: PropTypes.number,
  childId: PropTypes.number,
  childContext: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  index: PropTypes.number,
  auth: PropTypes.object,
};

export default Post;
