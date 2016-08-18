import React, { Component } from 'react';
import Header from './shared/header/Header';
import Footer from './shared/footer/Footer';
import styles from './App.scss';

class App extends Component {

  render() {
    return (
      <div className={styles.app}>
        <Header />

        {
          this.props.children
        }

        <Footer />
      </div>
    );
  }
};

export default App;
