import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  onToggleReplyMode,

} from '../../actions/posts/replyActions';
import styles from './Reply.scss';

class Reply extends Component {
  constructor() {
    super();
    this.handleToggleReplyMode = this.handleToggleReplyMode.bind(this);
  }

  handleToggleReplyMode(e) {
    const { dispatch, index } = this.props;
    dispatch(onToggleReplyMode(index));
  }

  render() {
    const { replyMode } = this.props;
    return (
      <div className={styles.destroyPost}>
        { replyMode &&
          <div className={styles.u_full_width}>
            <form>
              <label htmlFor="reply">reply</label>
              <input
                ref="reply"
                type='text'
                id='reply'
                className="u-full-width"
                placeholder='say something nice...'
                value={this.props.newPostBody}
                onChange={this.handleBodyChange}
              />
              <div className="create-public-private-btns">
                <button onClick={this.handleSubmitPost}>post</button>
              </div>
            </form>
          </div>
        }
        { !replyMode &&
          <div
            className="reply"
            onClick={this.handleToggleReplyMode}
          >
            [ reply ]
          </div>
        }
      </div>
    );
  }
};

Reply.propTypes = {
  id: React.PropTypes.number,
};

const mapStateToProps = (state, ownProps) => {
  return {
    replyMode: state.rootReducer.postReducer
      .get('posts').get(ownProps.index).get('replyMode'),
  }
};

export default connect(
  mapStateToProps
)(Reply);
