import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import NewPost from '../newPost/NewPost';
import PostList from '../postList/PostList';
import styles from './AllPosts.module.scss';
import { fetchPosts } from '../../../actions/posts/postActions';

const AllPosts = ({ auth }) => {
  const dispatch = useDispatch();
  const { post, profile } = useSelector(state => state.root);

  const posts = post.get('posts').toJS();
  const isFetching = post.get('isFetching');
  const lastUpdated = post.get('lastUpdated');
  const isAuthenticated = profile.get('isAuthenticated');

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className={styles.allPosts}>
      <h1>PostStream</h1>

      <div className={styles.lastUpdated}>
        stream was last updated at {new Date(lastUpdated).toLocaleTimeString()}.
        {' '}
      </div>

      {isAuthenticated &&
        <NewPost auth={auth} />
      }
      <hr />

      <PostList
        posts={posts}
        isAuthenticated={isAuthenticated}
      />

    </div>
  );
};

AllPosts.propTypes = {
  auth: PropTypes.object,
};

export default AllPosts;
