import React from 'react';
import styles from './Footer.scss';

const Footer = () => (
  <div>
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <a href='http://www.callmejoe.net/'><p>site by ray and joe</p></a>
      </div>
    </footer>
  </div>
);

export default Footer
