import React, { Component } from 'react';
import NewsStream from './components/NewsStream';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="App">
        <h1>Post Stream</h1>
        <NewsStream data={this.state.streamData} />
      </div>
    );
  }
};

export default App;
