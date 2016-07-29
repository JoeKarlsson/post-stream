import React, { Component } from 'react';
import Post from './Post';

class NewsStream extends Component {
  render() {
    var posts = this.props.data.map(( post ) => {
      return (
        <Post
          real_name={ post.real_name }
          username={post.username}
          created_at={post.created_at}
          body={post.body}
          key={post.id}
          comments={post.hasOwnProperty('comments') ? post.comments : []}
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
