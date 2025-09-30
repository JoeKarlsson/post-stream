import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  onToggleReplyMode,
  handleReplyBodyChange,
  submitNewReply,
} from "../../../actions/posts/replyActions";
import styles from "./Reply.module.scss";

const Reply = ({ index, id }) => {
  const dispatch = useDispatch();
  const replyRef = useRef();

  const replyMode = useSelector((state) =>
    state.post.get("posts").get(index).get("replyMode")
  );
  const replyBody = useSelector((state) =>
    state.post.get("posts").get(index).get("replyBody")
  );

  const handleToggleReplyMode = () => {
    dispatch(onToggleReplyMode(index));
  };

  const handleBodyChange = (e) => {
    dispatch(handleReplyBodyChange(e.target.value, index));
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    const actionData = {
      replyBody,
      index,
      id,
      commentId: 0,
      userID: "JoeJoebinks131",
    };
    dispatch(submitNewReply(actionData));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSubmitReply(event);
    }
  };

  const handleCancelKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggleReplyMode();
    }
  };

  return (
    <div className={styles.destroyPost}>
      {replyMode && (
        <div className={styles.u_full_width}>
          <form>
            <label className={styles.replyLabel} htmlFor="reply">
              reply
            </label>
            <textarea
              ref={replyRef}
              type="text"
              id="reply"
              rows="3"
              className="u-full-width"
              placeholder="say something nice..."
              value={replyBody}
              onChange={handleBodyChange}
            ></textarea>
            <div>
              [
              <span
                className={styles.postReplyBotton}
                onClick={handleSubmitReply}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
              >
                {" "}
                reply{" "}
              </span>
              ]
            </div>
            <div>
              [
              <span
                className={styles.cancelReplyButton}
                onClick={handleToggleReplyMode}
                onKeyDown={handleCancelKeyDown}
                tabIndex={0}
                role="button"
              >
                {" "}
                cancel{" "}
              </span>
              ]
            </div>
          </form>
        </div>
      )}
      {!replyMode && (
        <div>
          [{" "}
          <span
            className={styles.replyButton}
            onClick={handleToggleReplyMode}
            onKeyDown={handleCancelKeyDown}
            tabIndex={0}
            role="button"
          >
            reply
          </span>{" "}
          ]
        </div>
      )}
    </div>
  );
};

Reply.propTypes = {
  id: PropTypes.number,
  index: PropTypes.number,
};

export default Reply;
