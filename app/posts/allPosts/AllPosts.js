import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../singlePost/Post';
import NewPost from '../newPost/NewPost';
import styles from './AllPosts.scss';
import { fetchPostsIfNeeded } from '../../actions/postActions';

class AllPosts extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPostsIfNeeded());
  };

  render() {
    const postNode = this.props.posts.map(( post, i ) => {
      return (
        <Post
          {...post}
          key={i}
        />
      );
    });

    return (
      <div className={styles.allPosts}>
        <NewPost />
        <h1>Post Stream</h1>

        <span>
          Last updated at {new Date(this.props.lastUpdated).toLocaleTimeString()}.
          {' '}
        </span>

        {this.props.posts.length === 0 &&
          <h2>Loading...</h2>
        }

        {this.props.posts.length > 1 &&
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
    posts: state.postReducer.get('posts').toArray(),
    isFetching: state.postReducer.get('isFetching'),
    lastUpdated: state.postReducer.get('lastUpdated')
  }
};

export default connect(
  mapStateToProps
)(AllPosts);
