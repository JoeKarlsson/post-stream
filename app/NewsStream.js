import React, { Component } from 'react';

class NewsStream extends Component {
  render() {
    console.log(this.props.data);
    return (
        <div className="App">
          <h1>Feed</h1>
        </div>
    );
  }
}

export default NewsStream;
