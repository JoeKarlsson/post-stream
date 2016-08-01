import React, { Component } from 'react';
import CommentCount from './CommentCount';
import Styles from './Post.scss';

class Post extends Component {
  constructor() {
    super();

    this.state = {
      showChild: false,
      isParentPost: null,
      real_name: '',
      username: '',
      body: '',
      created_at: '',
      comments: [],
      childId: null,
      childContext: {}
    };

    this.handleShowingChild = this.handleShowingChild.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  handleShowingChild() {
    if (this.state.comments.length) {
      this.setState({showComments: !this.state.showComments});
    }
  }

  componentDidMount() {
    let newState = {
      isParentPost: this.props.isParentPost,
      real_name: this.props.real_name,
      username: this.props.username,
      body: this.props.body,
      created_at: this.props.created_at,
      comments: this.props.comments || []
    };

    if (newState.comments.length) {
      newState.childId = 0;
      newState.childContext = newState.comments[0];
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

  renderCommentCount(length, handler) {
    return (
      <CommentCount
        numOfComments={length}
      />
    );
  }

  render() {
    return (
      <div className={Styles.post}>
        <header>
          <span className={Styles.realName}>{this.state.real_name}</span>
          <span className="username">{`[${this.state.username}]`}</span>
          <span className="createdAt">{this.state.created_at}</span>
        </header>
        <p>{this.props.body}</p>
        <div className="comment-count" onClick={this.handleShowingChild}>
          {
            !this.state.showComments
            && this.renderCommentCount(this.state.comments.length)
          }
        </div>
        {
          this.state.showComments
          &&
          <div>
            <div className={Styles.inputContainer}>
              <span onClick={this.handlePrev}>&lt;&lt;&nbsp;left</span>
              <span className="length">{`${this.state.childId + 1} of ${this.state.comments.length}`}</span>
              <span onClick={this.handleShowingChild}>&#91;close&#93;</span>
              <span onClick={this.handleNext}>right&nbsp;&gt;&gt;</span>
            </div>
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
}
 export default Post;
