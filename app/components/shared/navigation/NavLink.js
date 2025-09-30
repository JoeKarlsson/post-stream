import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import styles from './NavLink.module.scss';

const NavLink = (props) => {
  return <RouterNavLink {...props} className={({ isActive }) => isActive ? styles.active : ''} />;
};

export default NavLink;
