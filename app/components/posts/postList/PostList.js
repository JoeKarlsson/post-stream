import React from 'react';
import PropTypes from 'prop-types';
import Post from '../singlePost/Post';
import styles from './PostList.module.scss';

const PostList = ({ posts, auth }) => {
  const postNode = posts.map((post, i) => {
    return (
      <Post
        {...post}
        index={i}
        key={i}
        auth={auth}
      />
    );
  });

  return (
    <div className={styles.PostList}>

      {posts.length === 0 &&
        <h2>Loading...</h2>
      }

      {posts.length > 2 &&
        <div>
          {postNode}
        </div>
      }
    </div>
  );
};

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  auth: PropTypes.object,
};

export default PostList;
