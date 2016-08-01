import React, { Component } from 'react';
import Post from './Post';
import Styles from './NewsStream.scss';

class NewsStream extends Component {
  render() {
    return (
      <div className={Styles.newsStream}>
        {this.props.data.map(( post ) => {
          return (
              <Post
            {...post}
            comments={post.hasOwnProperty('comments') ? post.comments : []}
            isParentPost={true}
            key={post.id}
              />
          );
        })}
      </div>
    );
  }
}

export default NewsStream;
