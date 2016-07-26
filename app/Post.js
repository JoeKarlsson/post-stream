import React, { Component } from 'react';

class Post extends Component {
  render() {
    return (
        <div className="post">
        <header>
        <span>{this.props.data.real_name}</span>
        <span>{this.props.data.username}</span>
        <span>{this.props.data.created_at}</span>
        </header>
        <p>{this.props.data.body}</p>
        
        </div>
    );
  }
};


export default Post;
