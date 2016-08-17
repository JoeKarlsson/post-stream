import React, { Component } from 'react';
import Post from './Post';

class NewsStream extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    };
    this.onData = this.onData.bind(this);
    this.onError = this.onError.bind(this);
  }

  onData(data) {
    const parsedData = JSON.parse(data.currentTarget.response);
    console.log('parsedData: ', parsedData);
    this.setState({ posts: parsedData });
  };

  onError(data) {
    console.error(this.props.redditUrl, status, err.toString());
  };

  getAllPosts() {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", this.onData);
    oReq.addEventListener("error", this.onError);
    oReq.open("GET", '/post');
    oReq.send();
  }

  componentDidMount() {
    this.getAllPosts();
  }

  render() {
    var posts = this.state.posts.map(( post ) => {
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
        <div className="App">
          <h1>Feed</h1>
          {posts}
        </div>
    );
  }
}

NewsStream.propTypes = {
  posts: React.PropTypes.array,
};

NewsStream.defaultProps = {
  posts: [],
};

export default NewsStream;
