import React from 'react';
import PropTypes from 'prop-types';
import styles from './LogoutButton.module.scss';

const LogoutButton = ({ onLogoutClick }) => {
  return (
    <li>[ <span className={styles.logoutButton} onClick={() => onLogoutClick()}>logout</span> ]</li>
  );
};

LogoutButton.propTypes = {
  onLogoutClick: PropTypes.func.isRequired
};

export default LogoutButton;