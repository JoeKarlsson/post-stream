import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NewPost from '../newPost/NewPost';
import PostList from '../postList/PostList';
import styles from './AllPosts.scss';
import { fetchPosts } from '../../../actions/posts/postActions';

class AllPosts extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPosts());
  };

  render() {
    const {
      posts,
      lastUpdated,
      isAuthenticated,
    } = this.props;

    return (
      <div className={styles.allPosts}>
        <h1>PostStream</h1>

        <div className={styles.lastUpdated}>
          stream was last updated at {new Date(lastUpdated).toLocaleTimeString()}.
          {' '}
        </div>

        {isAuthenticated &&
          <NewPost auth={this.props.auth} />
        }
        <hr />

        <PostList
          posts={posts}
          isAuthenticated={isAuthenticated}
        />

      </div>
    );
  }
};

AllPosts.propTypes = {
  posts: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { post } = state.root;

  return {
    posts: post.get('posts').toJS(),
    isFetching: post.get('isFetching'),
    lastUpdated: post.get('lastUpdated'),
  }
};

export default connect(
  mapStateToProps
)(AllPosts);
