import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../singlePost/Post';
import NewPost from '../newPost/NewPost';
import styles from './AllPosts.scss';
import { fetchPostsIfNeeded } from '../../actions/postActions';

class NewsStream extends Component {
  constructor() {
    super();
    this.handleNewPost = this.handleNewPost.bind(this);
  };

  handleNewPost(newPost) {
    let newPosts = this.state.posts
    newPosts.push(newPost);
    this.setState({
      posts: newPosts
    })
  };

  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props;
    dispatch(fetchPostsIfNeeded());
  };

  render() {
    const posts = this.props.posts.map(( post ) => {
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
        <div className={styles.newsStream}>
          <h2>News Feed</h2>
          <NewPost
            onNewPost={this.handleNewPost}
          />
          <h1>Feed</h1>
          {posts.length === 0 &&
            <h2>Loading...</h2>
          }
          {posts.length > 0 &&
            <div>
              {posts}
            </div>
          }
        </div>
    );
  }
};

NewsStream.propTypes = {
  posts: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    posts: state.postReducer.toJS().posts,
  }
};

export default connect(
  mapStateToProps
)(NewsStream);
