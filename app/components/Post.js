import React, { Component } from 'react';

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
        <div className="post-comment-count">
          <span>
          {(_ => {
            let numberOfComments = this.props.comments.length;
            switch (true) {
              case numberOfComments > 0: return `[ ${numberOfComments} comments ]`;
              default: return "No Comments";
            }
          })()}
          </span>
        </div>
      </div>
    );
  }
};

export default Post;
