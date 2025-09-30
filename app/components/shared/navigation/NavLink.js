import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import styles from './NavLink.scss';

class NavLink extends React.Component {
  render() {
    return <RouterNavLink {...this.props} className={({ isActive }) => isActive ? styles.active : ''} />;
  }
}

export default NavLink;
