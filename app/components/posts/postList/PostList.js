import React, { Component } from 'react';
import Post from '../singlePost/Post';
import styles from './PostList.scss';

class PostList extends Component {
  render() {
    const {
      posts,
    } = this.props;

    const postNode = posts.map(( post, i ) => {
      return (
        <Post
          {...post}
          index={i}
          key={i}
          auth={this.props.auth}
        />
      );
    });

    return (
      <div className={styles.PostList}>

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

PostList.propTypes = {
  posts: React.PropTypes.array.isRequired,
};

export default PostList;
