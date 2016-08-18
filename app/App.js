import React, { Component } from 'react';
import NewsStream from './posts/allPosts/NewsStream';
import styles from './App.scss';

class App extends Component {

  render() {
    return (
      <div className={styles.app}>
        <h1>Post Stream</h1>
        <NewsStream />
      </div>
    );
  }
};

export default App;
