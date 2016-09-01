import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../singlePost/Post';
import NewPost from '../newPost/NewPost';
import styles from './AllPosts.scss';
import { fetchPostsIfNeeded } from '../../actions/posts/postActions';

class AllPosts extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPostsIfNeeded());
  };

  render() {
    const {
      posts,
      lastUpdated,
      isLoggedIn,
      username
    } = this.props;

    const postNode = posts.map(( post, i ) => {
      return (
        <Post
          {...post}
          index={i}
          key={i}
        />
      );
    });

    return (
      <div className={styles.allPosts}>
        <h1>stream</h1>

        <NewPost />
        { isLoggedIn === true &&
          <p>welcome back {username}</p>
        }

        <span>
          stream was last updated at {new Date(lastUpdated).toLocaleTimeString()}.
          {' '}
        </span>

        <hr />

        { posts.length === 0 &&
          <h2>Loading...</h2>
        }

        { posts.length > 2 &&
          <div>
            {postNode}
          </div>
        }
      </div>
    );
  }
};

AllPosts.propTypes = {
  posts: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    posts: state.rootReducer.postReducer.get('posts').toJS(),
    isFetching: state.rootReducer.postReducer.get('isFetching'),
    lastUpdated: state.rootReducer.postReducer.get('lastUpdated'),
    isLoggedIn: state.rootReducer.authReducer.get('isLoggedIn'),
    username: state.rootReducer.authReducer.get('username'),
  }
};

export default connect(
  mapStateToProps
)(AllPosts);
