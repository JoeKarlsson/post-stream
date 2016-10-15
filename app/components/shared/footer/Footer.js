import React from 'react';
import styles from './Footer.scss';

const Footer = ({item}) => (
  <div>
    <hr/>
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <p>/* site by <a href='http://www.rayfarias.com'>ray</a>, <a href='http://jacobyyoung.com/'>jacoby</a> and <a href='http://www.callmejoe.net/'>joe</a> */</p>
      </div>
    </footer>
  </div>
);

export default Footer
