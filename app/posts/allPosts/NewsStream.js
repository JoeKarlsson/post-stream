import React, { Component } from 'react';
import Post from '../singlePost/Post';
import NewPost from '../newPost/NewPost';
import styles from './NewsStream.scss';

class NewsStream extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    };
    this.onData = this.onData.bind(this);
    this.onError = this.onError.bind(this);
    this.handleNewPost = this.handleNewPost.bind(this);
  }

  onData(data) {
    const parsedData = JSON.parse(data.currentTarget.response);
    console.log('parsedData: ', parsedData);
    this.setState({ posts: parsedData });
  };

  onError(err) {
    console.error('newstream', status, err.toString());
  };

  getAllPosts() {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", this.onData);
    oReq.addEventListener("error", this.onError);
    oReq.open("GET", '/post');
    oReq.send();
  }

  handleNewPost(newPost) {
    let newPosts = this.state.posts
    newPosts.push(newPost);
    this.setState({
      posts: newPosts
    })
  };

  componentDidMount() {
    this.getAllPosts();
  };

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
        <div className={styles.newsStream}>
          <NewPost
            onNewPost={this.handleNewPost}
          />
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
