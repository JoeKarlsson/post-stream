import React, { Component } from 'react';
// import NewsStream from './posts/allPosts/NewsStream';
import NavLink from './shared/navigation/NavLink'
import styles from './App.scss';

class App extends Component {

  render() {
    return (
      <div className={styles.app}>
        <header className={styles.header_bar}>

          <NavLink to='/' onlyActiveOnIndex={true} className={styles.header_logo}>post stream</NavLink>
          <ul className={styles.header_nav}>
            <li><NavLink to='/about'>about</NavLink></li>
          </ul>
        </header>

        {
          this.props.children
        }

        <footer className={styles.footer}>
          <div className={styles.footer_content}>
            <a href='http://www.callmejoe.net/'><p>site by ray and joe</p></a>
          </div>
        </footer>
      </div>
    );
  }
};

export default App;
