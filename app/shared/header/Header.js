import React from 'react';
import NavLink from '../navigation/NavLink';
import styles from './Header.scss';

const Header = () => (
  <div>
    <header className={styles.header_bar}>
      <NavLink to='/' onlyActiveOnIndex={true} className={styles.header_logo}>PostStream</NavLink>
      <ul className={styles.header_nav}>
        <li><NavLink to='/about'>about</NavLink></li>
        <li><NavLink to='/register'>register</NavLink></li>
        <li><NavLink to='/login'>login</NavLink></li>
        <li><NavLink to='/logout'>logout</NavLink></li>
      </ul>
    </header>
  </div>
);

export default Header;
