import React, { Component } from 'react';

const Post = (props) => {
  return (
    <div className="post">
      <header>
        <span>{props.real_name}</span>
        <span>{props.username}</span>
        <span>{props.created_at}</span>
      </header>
      <p>{props.body}</p>
    </div>
  )
};

class NewsStream extends Component {
  render() {
    console.log(this.props.data)
    var posts = this.props.data.map(( post ) => <Post real_name={post.real_name} username={post.username} created_at={post.created_at} body={post.body} key={post.id} />);

    return (
        <div className="App">
          <h1>Feed</h1>
          {posts}
        </div>
    );
  }
}

export default NewsStream;
