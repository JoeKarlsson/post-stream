import React from 'react';
import styles from './NoMatch.scss';

class NoMatch extends React.Component {
  render() {
    return (
      <div className={styles.noMatch}>
        404 - sry no page found
      </div>
    );
  }
}

export default NoMatch;
