import React from 'react';
import styles from './Footer.module.scss';

const Footer = ({ item }) => (
  <div>
    <footer className={ styles.footer }>
      <div className={ styles.footer_content }>
        <p>/* site by <a target='_blank' href='http://www.rayfarias.com'>ray</a>, <a target='_blank' href='http://jacobyyoung.com/'>jacoby</a> and <a target='_blank' href='http://www.callmejoe.net/'>joe</a> */</p>
      </div>
    </footer>
  </div>
);

export default Footer
