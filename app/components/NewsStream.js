import React, { Component } from 'react';
import Post from './Post';

class NewsStream extends Component {
  render() {
    var posts = this.props.data.map(( post ) => {
      return (
        <Post
          {...post}
          comments={post.hasOwnProperty('comments') ? post.comments : []}
          isParentPost={true}
          key={post.id}
        />
      );
    });

    return (
        <div className="App">
          <h1>Feed</h1>
          {posts}
        </div>
    );
  }
}

export default NewsStream;
