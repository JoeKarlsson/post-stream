import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  onToggleReplyMode,
  handleReplyBodyChange,

} from '../../actions/posts/replyActions';
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

  handleSubmitReply(e){
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
                value={ this.props.replyBody }
                onChange={ this.handleBodyChange }
              />
              <div>
                <button onClick={this.handleSubmitReply}>reply</button>
              </div>
              <div>
                <button onClick={this.handleToggleReplyMode}>cancel</button>
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
    replyBody: state.rootReducer.postReducer
      .get('posts').get(ownProps.index).get('replyBody'),
  }
};

export default connect(
  mapStateToProps
)(Reply);
