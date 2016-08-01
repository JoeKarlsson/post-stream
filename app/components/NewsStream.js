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
        <header>
        <h1>stream</h1>
        </header>
        {posts}
      </div>
    );
  }
}

export default NewsStream;
