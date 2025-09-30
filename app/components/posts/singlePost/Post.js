import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Remarkable } from 'remarkable';
import twemoji from 'twemoji';
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
import styles from './Post.module.scss';

const Post = ({
  username,
  realName,
  commentCount,
  id,
  index,
  isParentPost,
  createdAt,
  body,
  comments,
  auth
}) => {
  const dispatch = useDispatch();
  const { profile, post } = useSelector(state => state.root);

  const editMode = post.get('posts').get(index).get('editMode');
  const showComments = post.get('posts').get(index).get('showComments');
  const childId = post.get('posts').get(index).get('childId');
  const childContext = post.get('posts').get(index).get('childContext');
  const postUserID = post.get('posts').get(index).get('userID');
  const isAuthenticated = profile.get('isAuthenticated');
  const profileData = profile.get('profile').toJS();

  const rawMarkup = useMemo(() => {
    const md = new Remarkable();
    const rawMarkup = md.render(body.toString());
    const output = twemoji.parse(rawMarkup, {
      folder: 'svg',
      ext: '.svg'
    });
    return { __html: output };
  }, [body]);

  const getRandomColor = () => {
    const colors = [
      'teal',
      'red',
      'purple',
      'orange',
      'pink',
      'lightGreen',
      'forrestGreen'
    ];

    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  };

  const handleToggleComments = () => {
    dispatch(toggleShowComment(index, !showComments));
  };

  const handleEdit = () => {
    dispatch(toggleEditMode(index, !editMode));
  };

  const handleShowingChild = () => {
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

    if (newChildId < comments.length) {
      dispatch(toggleComment(index, newChildId));
    }
  };

  const color = getRandomColor();

  return (
    <div className={styles.post}>

      {editMode === false && isParentPost &&
        <div>
          <div className={styles.statusBar}>
            [<Link to={`/user/${username}`} className={styles.username}> {realName} </Link>] | <span className={styles.timeStamp}>{new Date(createdAt).toLocaleTimeString()}</span>
          </div>

          <span className={styles[color]} dangerouslySetInnerHTML={rawMarkup} />

          {isAuthenticated && postUserID === profileData.user_id &&
            <div>
              [ <span className={styles.editButton} onClick={handleEdit}>edit</span> ]
              <DestroyPostButton
                id={id}
                index={index}
              />

            </div>
          }
          {isAuthenticated &&
            <Reply
              id={id}
              index={index}
              auth={auth}
            />
          }
          <div className='comment-count' onClick={handleShowingChild}>
            <CommentCount
              numOfComments={commentCount}
            />
          </div>
        </div>
      }

      {!isParentPost &&
        <div>
          <span className={styles[color]} dangerouslySetInnerHTML={rawMarkup} />

          {!showComments &&
            <div className='comment-count' onClick={handleShowingChild}>
            </div>
          }

          {showComments &&
            <div className='comment-count' onClick={handleToggleComments}>
              <CommentCount
                numOfComments={commentCount}
              />
            </div>
          }
        </div>
      }

      {editMode === true &&
        <EditPost
          id={id}
          index={index}
        />
      }

      {showComments &&
        <div className='replies'>

          {childId !== 0 &&
            <span>[<span className={styles.leftButton} onClick={handlePrev}> left </span>]</span>
          }

          {childId !== commentCount - 1 &&
            <span>[<span className={styles.rightButton} onClick={handleNext}> right </span>]</span>
          }

          <Post
            {...childContext}
            dispatch={dispatch}
            isParentPost={false}
            key={childContext.id}
          />

        </div>
      }

      {isParentPost &&
        <hr />
      }
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
