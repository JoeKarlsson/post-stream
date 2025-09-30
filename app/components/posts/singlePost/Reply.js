import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  onToggleReplyMode,
  handleReplyBodyChange,
  submitNewReply,

} from '../../../actions/posts/replyActions';
import styles from './Reply.scss';

class Reply extends Component {
  constructor() {
    super();
    this.handleToggleReplyMode = this.handleToggleReplyMode.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handleSubmitReply = this.handleSubmitReply.bind(this);
  }

  handleToggleReplyMode() {
    const { dispatch, index } = this.props;
    dispatch(onToggleReplyMode(index));
  }

  handleBodyChange(e) {
    const { dispatch, index } = this.props;
    dispatch(handleReplyBodyChange(e.target.value, index))
  }

  handleSubmitReply(e) {
    e.preventDefault();
    const {
      dispatch,
      index,
      id,
      replyBody
    } = this.props;
    const actionData = {
      replyBody,
      index,
      id,
      commentId: 0,
      userID: 'JoeJoebinks131'
    }
    dispatch(submitNewReply(actionData));
  }

  render() {
    const { replyMode, replyBody } = this.props;
    return (
      <div className={styles.destroyPost}>
        {replyMode &&
          <div className={styles.u_full_width}>
            <form>
              <label className={styles.replyLabel} htmlFor="reply">reply</label>
              <textarea
                ref="reply"
                type='text'
                id='reply'
                rows='3'
                className="u-full-width"
                placeholder='say something nice...'
                value={replyBody}
                onChange={this.handleBodyChange}
              ></textarea>
              <div>
                [<span className={styles.postReplyBotton} onClick={this.handleSubmitReply}> reply </span>]
              </div>
              <div>
                [<span className={styles.cancelReplyButton} onClick={this.handleToggleReplyMode}> cancel </span>]

              </div>
            </form>
          </div>
        }
        {!replyMode &&
          <div>
            [ <span
              className={styles.replyButton}
              onClick={this.handleToggleReplyMode}
            >reply</span> ]
          </div>
        }
      </div>
    );
  }
};

Reply.propTypes = {
  id: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => {
  return {
    replyMode: state.root.post
      .get('posts')
      .get(ownProps.index)
      .get('replyMode'),
    replyBody: state.root.post
      .get('posts')
      .get(ownProps.index)
      .get('replyBody'),
  }
};

export default connect(
  mapStateToProps
)(Reply);
