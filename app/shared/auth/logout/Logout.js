import React from 'react';
import styles from './Logout.scss';

class Logout extends React.Component {
  render() {
    return (
      <div className={styles.Logout}>
        <h2 className="section-heading">You are now logged out</h2>
      </div>
    );
  }
};

export default Logout;
