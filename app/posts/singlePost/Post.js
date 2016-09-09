import React, { Component } from 'react';
import CommentCount from './CommentCount';
import { connect } from 'react-redux';
const Remarkable = require('remarkable');
import {
  toggleComment,
  fetchCommentsIfNeeded,
} from '../../actions/posts/commentActions';
import {
  toggleEditMode,
} from '../../actions/posts/editPostActions';
import DestroyPostButton from './DestroyPostButton';
import Reply from './Reply';
import EditPost from './../editPost/EditPost';
import styles from './Post.scss';

class Post extends Component {
  constructor() {
    super();
    this.handleEdit = this.handleEdit.bind(this);
    this.handleShowingChild = this.handleShowingChild.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  };

  rawMarkup() {
    const { body } = this.props;
    var md = new Remarkable();
    var rawMarkup = md.render(body.toString());
    return { __html: rawMarkup };
  };

  handleEdit() {
    const { dispatch, index, editMode } = this.props;
    dispatch(toggleEditMode(index, !editMode));
  };

  handleShowingChild() {
    const { dispatch, id, index } = this.props;
    dispatch(fetchCommentsIfNeeded(id, index));
  };

  handlePrev() {
    const {
      dispatch,
      index,
      childId,
    } = this.props;

    const newChildId = childId - 1;

    if (!!~newChildId) {
      dispatch(toggleComment(index, newChildId));
    }
  };

  handleNext() {
    const {
      dispatch,
      index,
      childId,
      comments
    } = this.props;

    const newChildId = childId + 1;

    if (newChildId < comments.length) {
      dispatch(toggleComment(index, newChildId));
    }
  };

  render() {
    const {
      username,
      realName,
      commentCount,
      showComments,
      childContext,
      id,
      index,
      editMode,
      isParentPost,
      createdAt,
      dispatch,
    } = this.props;

    return (
      <div className={styles.post}>

        { editMode === false && isParentPost &&
          <div>
            <div>
              {username} | {realName} | {new Date(createdAt).toLocaleTimeString()}
            </div>

            <span dangerouslySetInnerHTML={this.rawMarkup()} />
            <span onClick={this.handleEdit}>[ edit ]</span>
            <DestroyPostButton
              id={id}
              index={index}
            />

            <Reply
              id={id}
              index={index}
            />

            <div className='comment-count' onClick={this.handleShowingChild}>
              <CommentCount
                numOfComments={commentCount}
              />
            </div>
          </div>
        }

        { !isParentPost &&
          <div>
            <span dangerouslySetInnerHTML={this.rawMarkup()} />

            <div className='comment-count' onClick={this.handleShowingChild}>
              <CommentCount
                numOfComments={commentCount}
              />
            </div>
          </div>
        }

        { editMode === true &&
          <EditPost
            id={id}
            index={index}
          />
        }

        { showComments &&
          <div className='replies'>
            <span onClick={this.handlePrev}>[ left ] </span>
            <span onClick={this.handleNext}>[ right ]</span>
              <Post
                {...childContext}
                dispatch={dispatch}
                isParentPost={false}
                key={childContext.id}
              />
          </div>
        }

        { isParentPost &&
          <hr/>
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
  // console.log(state.rootReducer.postReducer
  //     .get('posts').get(ownProps.index).get('comments').toJS());
  return {
    editMode: state.rootReducer.postReducer
      .get('posts').get(ownProps.index).get('editMode'),
    showComments: state.rootReducer.postReducer
      .get('posts').get(ownProps.index).get('showComments'),
    childId: state.rootReducer.postReducer
      .get('posts').get(ownProps.index).get('childId'),
    childContext: state.rootReducer.postReducer
      .get('posts').get(ownProps.index).get('childContext'),
  }
};

export default connect(
  mapStateToProps
)(Post);
