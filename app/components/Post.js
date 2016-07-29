import React, { Component } from 'react';
import CommentCount from './CommentCount';

class Post extends Component {
  render() {
    return (
      <div className="post">
        <header>
          <span>{this.props.real_name}</span>
          <span>{this.props.username}</span>
          <span>{this.props.created_at}</span>
        </header>
        <p>{this.props.body}</p>
        <CommentCount numOfComments={this.props.comments.length} />
      </div>
    );
  }
};

export default Post;
