import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
const Remarkable = require('remarkable');
const emojione = require('emojione');
import {
  toggleComment,
  fetchCommentsIfNeeded,
  toggleShowComment,
} from '../../../actions/posts/commentActions';
import {
  toggleEditMode,
} from '../../../actions/posts/editPostActions';
import CommentCount from './CommentCount';
import DestroyPostButton from './DestroyPostButton';
import Reply from './Reply';
import EditPost from './../editPost/EditPost';
import styles from './Post.scss';

class Post extends Component {
  constructor() {
    super();
    this.handleEdit = this.handleEdit.bind(this);
    this.handleToggleComments = this.handleToggleComments.bind(this);
    this.handleShowingChild = this.handleShowingChild.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  };

  rawMarkup() {
    const { body } = this.props;
    var md = new Remarkable();
    var rawMarkup = md.render(body.toString());
    let output = emojione.shortnameToImage(rawMarkup);
    return { __html: output };
  };

  handleToggleComments() {
    const {dispatch, index, showComments } = this.props;
    dispatch(toggleShowComment(index, !showComments));
  }

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

  getRandomColor() {
    const colors = [
      'teal',
      'red',
      'purple',
      'orange',
      'pink',
      'lightGreen',
      'forrestGreen'
    ];

    const color = colors[Math.floor(Math.random()*colors.length)];
    return color;
  }

  render() {
    const {
      username,
      realName,
      commentCount,
      showComments,
      childContext,
      childId,
      id,
      index,
      editMode,
      isParentPost,
      createdAt,
      dispatch,
      isAuthenticated,
      postUserID,
      profile,
    } = this.props;

    const color = this.getRandomColor();

    return (
      <div className={styles.post}>

        { editMode === false && isParentPost &&
          <div>
            <div className={ styles.statusBar }>
              [<Link to={`/user/${username}`} className={ styles.username }> { realName } </Link>] | <span className={ styles.timeStamp }>{ new Date(createdAt).toLocaleTimeString() }</span>
            </div>

            <span className={ styles[color] } dangerouslySetInnerHTML={ this.rawMarkup() } />

            { isAuthenticated && postUserID === profile.user_id &&
              <div>
                [ <span className={ styles.editButton } onClick={ this.handleEdit }>edit</span> ]
                <DestroyPostButton
                  id={id}
                  index={index}
                />

              </div>
            }
            { isAuthenticated &&
              <Reply
                id={id}
                index={index}
                auth={this.props.auth}
              />
            }
            <div className='comment-count' onClick={this.handleShowingChild}>
              <CommentCount
                numOfComments={commentCount}
              />
            </div>
          </div>
        }

        { !isParentPost &&
          <div>
            <span dangerouslySetInnerHTML={ this.rawMarkup() } />

            { !showComments &&
              <div className='comment-count' onClick={ this.handleShowingChild }>
              </div>
            }

            { showComments &&
              <div className='comment-count' onClick={this.handleToggleComments}>
                <CommentCount
                  numOfComments={commentCount}
                />
              </div>
            }
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

            { childId !== 0 &&
              <span>[<span className={ styles.leftButton } onClick={this.handlePrev}> left </span>]</span>
            }

            { childId !== commentCount-1 &&
              <span>[<span className={ styles.rightButton } onClick={this.handleNext}> right </span>]</span>
            }

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
  childContext: React.PropTypes.object,
  isAuthenticated: React.PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const { profile, post } = state.root;

  return {
    editMode: post
      .get('posts').get(ownProps.index).get('editMode'),
    showComments: post
      .get('posts').get(ownProps.index).get('showComments'),
    childId: post
      .get('posts').get(ownProps.index).get('childId'),
    childContext: post
      .get('posts').get(ownProps.index).get('childContext'),
    postUserID: post
      .get('posts').get(ownProps.index).get('userID'),
    isAuthenticated: profile.get('isAuthenticated'),
    profile: profile.get('profile').toJS(),
  }
};

export default connect(
  mapStateToProps
)(Post);
