import React, { Component } from 'react';
import CommentCount from './CommentCount';
import { connect } from 'react-redux';
import {
  handlePrevComment,
  handleNextComment,
  fetchCommentsIfNeeded,
} from '../../actions/commentActions';
import styles from './Post.scss';

class Post extends Component {
  constructor() {
    super();
    this.handleShowingChild = this.handleShowingChild.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  };

  handleShowingChild() {
    const { dispatch } = this.props;
    dispatch(fetchCommentsIfNeeded(this.props.id));
  }

  handlePrev(e) {
    let newChildId = this.props.childId - 1;

    if (!!~newChildId) {
      const { dispatch } = this.props;
      dispatch(handlePrevComment(this.props.id, newChildId));
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

        <header>
          <span>{this.props.username} </span>
          <span>{this.props.created_at} </span>
          <span>{this.props.realName} </span>
        </header>

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
                isParentPost={false}
                key={this.props.childContext.id}
              />
          </div>
        }
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
    // id: ownProps.id,
    // comments: ownProps.comments,
    showComments: state.postReducer.get('posts').get(ownProps.id - 1).showComments,
    // isParentPost: ownProps.isParentPost,
    // realName: ownProps.realName,
    // username: ownProps.username,
    // body: ownProps.body,
    // created_at: ownProps.created_at,
    // commentCount: ownProps.commentCount,
    childId: state.postReducer.get('posts').get(ownProps.id - 1).childId,
    childContext: state.postReducer.get('posts').get(ownProps.id - 1).childContext,
  }
};

export default connect(
  mapStateToProps
)(Post);
