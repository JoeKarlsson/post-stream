import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../singlePost/Post';
import NewPost from '../newPost/NewPost';
import styles from './AllPosts.scss';
import setItems from '../../actions/postActions';

class NewsStream extends Component {
  constructor() {
    super();
    this.onData = this.onData.bind(this);
    this.onError = this.onError.bind(this);
    this.handleNewPost = this.handleNewPost.bind(this);
  };

  onData(data) {
    const parsedData = JSON.parse(data.currentTarget.response);
    this.props.setItems({ posts: parsedData });
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
  };

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
    console.log('this.props: ', this.props);
    var posts = this.props.posts.map(( post ) => {
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
          {posts}
        </div>
    );
  }
};

// NewsStream.propTypes = {
//   posts: React.PropTypes.array.isRequired,
// };

// NewsStream.defaultProps = {
//   posts: [],
// };

const mapStateToProps = (state) => {
  return {
    posts: state.postReducer.toJS().posts,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setItems: (data) => {
      dispatch({
        type: 'SET_ITEMS',
        data: data
      })
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsStream);
