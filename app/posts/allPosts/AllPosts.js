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
    console.log('this.props: ', this.props);

    const postNode = this.props.posts.map(( post ) => {
      return (
        <Post
          {...post}
          comments={post.hasOwnProperty('comments') ? post.comments : []}
          isParentPost={true}
          key={post.id}
          id={post.id}
        />
      );
    });

    return (
        <div className={styles.allPosts}>
          <h2>News Feed</h2>
          <NewPost
            onNewPost={this.handleNewPost}
          />
          <h1>Feed</h1>

          <span>
            Last updated at {new Date(this.props.lastUpdated).toLocaleTimeString()}.
            {' '}
          </span>

          {this.props.posts.length === 0 &&
            <h2>Loading...</h2>
          }
          {this.props.posts.length > 0 &&
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
  // isFetching: PropTypes.bool.isRequired,
  // lastUpdated: PropTypes.number,
  // dispatch: PropTypes.func.isRequired
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
