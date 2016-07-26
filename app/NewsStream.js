import React, { Component } from 'react';
import Post from './Post';

class NewsStream extends Component {
  render() {
    var posts = this.props.data.map(( post ) => <Post data={ post } key={post.id} />);

    return (
        <div className="App">
          <h1>Feed</h1>
          {posts}
        </div>
    );
  }
}

export default NewsStream;
