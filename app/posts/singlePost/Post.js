import React, { Component } from 'react';
import CommentCount from './CommentCount';

class Post extends Component {
  constructor() {
    super();

    this.state = {
      id: null,
      showComments: false,
      isParentPost: null,
      real_name: '',
      username: '',
      body: '',
      created_at: '',
      commentCount: 0,
      comments: [],
      childId: null,
      childContext: {}
    };

    this.handleShowingChild = this.handleShowingChild.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.getAllComments = this.getAllComments.bind(this);
    this.onCommentData = this.onCommentData.bind(this);
    this.onCommentError = this.onCommentError.bind(this);
  };

  onCommentData(data) {
    const parsedCommentData = JSON.parse(data.currentTarget.response);
    console.log('parsedCommentData: ', parsedCommentData);
    this.setState({
      showComments: true,
      comments: parsedCommentData,
      childId: 0,
      childContext: parsedCommentData[0],
    });
  };

  onCommentError(err) {
    console.error(status, err.toString());
  };

  getAllComments() {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", this.onCommentData);
    oReq.addEventListener("error", this.onCommentError);
    oReq.open("GET", `/post/${this.state.id}/comments`);
    oReq.send();
  }

  handleShowingChild() {
    this.getAllComments();
  }

  componentDidMount() {
    let newState = {
      id: this.props.id,
      isParentPost: this.props.isParentPost,
      real_name: this.props.real_name,
      username: this.props.username,
      body: this.props.body,
      created_at: this.props.created_at,
      commentCount: this.props.commentCount
    };

    if (newState.commentCount) {
      newState.childId = 0;
    }

    this.setState(newState);
  }

  handlePrev(e) {
    let newChildId = this.state.childId - 1;

    if (!!~newChildId) {
      let newState = {
        childId: newChildId,
        childContext: this.state.comments[newChildId]
      };

      this.setState(newState);
    }
  }

  handleNext(e) {
    let newChildId = this.state.childId + 1;

    if (newChildId < this.state.comments.length) {
      let newState = {
        childId: newChildId,
        childContext: this.state.comments[newChildId]
      };

      this.setState(newState);
    }
  }

  render() {
    return (
      <div className="post">
        <header>
          <span>{this.state.real_name}</span>
          <span>{this.state.username}</span>
          <span>{this.state.created_at}</span>
        </header>
        <p>{this.props.body}</p>
        <div className="comment-count" onClick={this.handleShowingChild}>
          <CommentCount
            numOfComments={this.state.commentCount}
            togglePostComments={this.toggleComments}
          />
        </div>
        {
          this.state.showComments &&
            <div className="replies">
              <span onClick={this.handlePrev}>left</span>
              <span onClick={this.handleNext}> right</span>
                <Post
                  {...this.state.childContext}
                  isParentPost={false}
                  key={this.state.childContext.id}
                />
            </div>
        }
      </div>
    );
  }
};

Post.propTypes = {
  id: React.PropTypes.number,
  comments: React.PropTypes.arrayOf(React.PropTypes.object),
  showComments: React.PropTypes.bool,
  isParentPost: React.PropTypes.bool,
  real_name: React.PropTypes.string,
  username: React.PropTypes.string,
  body: React.PropTypes.string,
  created_at: React.PropTypes.number,
  commentCount: React.PropTypes.number,
  childId: React.PropTypes.number,
  childContext: React.PropTypes.object
};

Post.defaultProps = {
  comments: [],
};

export default Post;
