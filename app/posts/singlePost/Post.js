import React, { Component } from 'react';
import CommentCount from './CommentCount';
import { connect } from 'react-redux';
import {
  handlePrevComment,
  handleNextComment,
  fetchCommentsIfNeeded,
} from '../../actions/commentActions';
import DestroyPostButton from './DestroyPostButton.js';
import styles from './Post.scss';

class Post extends Component {
  constructor() {
    super();
    this.handleShowingChild = this.handleShowingChild.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  };

  handleShowingChild() {
    const { dispatch, id } = this.props;
    dispatch(fetchCommentsIfNeeded(id));
  }

  handlePrev(e) {
    let newChildId = this.props.childId - 1;

    if (!!~newChildId) {
      const { dispatch, id } = this.props;
      dispatch(handlePrevComment(id, newChildId));
    }
  };

  handleNext(e) {
    const newChildId = this.props.childId + 1;

    if (newChildId < this.props.comments.length) {
      const { dispatch } = this.props;
      dispatch(handleNextComment(this.props.id, newChildId));
    }
  };

  render() {
    return (
      <div className={styles.post}>

        <div>{this.props.username}</div>
        <div>{this.props.created_at}</div>
        <div>{this.props.realName}</div>
        <DestroyPostButton
          id={this.props.id}
          index={this.props.index}
        />

        <p>{this.props.body}</p>

        <div className="comment-count" onClick={this.handleShowingChild}>
          <CommentCount
            numOfComments={this.props.commentCount}
          />
        </div>
        {
          this.props.showComments &&
          <div className="replies">
            <span onClick={this.handlePrev}>left</span>
            <span onClick={this.handleNext}> right</span>
              <Post
                {...this.props.childContext}
                dispatch={this.props.dispatch}
                isParentPost={false}
                key={this.props.childContext.id}
              />
          </div>
        }
        <hr/>
      </div>
    );
  }
};

Post.propTypes = {
  id: React.PropTypes.number,
  comments: React.PropTypes.arrayOf(React.PropTypes.object),
  showComments: React.PropTypes.bool,
  isParentPost: React.PropTypes.bool,
  realName: React.PropTypes.string,
  username: React.PropTypes.string,
  body: React.PropTypes.string,
  created_at: React.PropTypes.number,
  commentCount: React.PropTypes.number,
  childId: React.PropTypes.number,
  childContext: React.PropTypes.object
};

const mapStateToProps = (state, ownProps) => {

  return {
    showComments: state.postReducer.get('posts').get(ownProps.index - 1).get('showComments'),
    childId: state.postReducer.get('posts').get(ownProps.index - 1).get('childId'),
    childContext: state.postReducer.get('posts').get(ownProps.index - 1).get('childContext'),
  }
};

export default connect(
  mapStateToProps
)(Post);
