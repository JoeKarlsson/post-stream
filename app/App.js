import React, { Component } from 'react';
import './App.css';
import Feed from './Feed';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Post Stream</h1>
        <Feed />
      </div>
    );
  }
}

export default App;
