import React from 'react';
import PropTypes from 'prop-types';
import NavLink from '../navigation/NavLink';
import LogoutButton from '../auth/logout/LogoutButton';
import { logoutUser } from '../../../actions/auth/logoutActions';
import styles from './Header.module.scss';

const Header = ({ dispatch, isAuthenticated, user }) => {
  return (
    <div>
      <header className={styles.header_bar}>
        <NavLink to='/' end className={styles.header_logo}>PostStream</NavLink>
        <ul className={styles.header_nav}>
          <li>[ <NavLink to='/about'>?</NavLink> ]</li>
          {!isAuthenticated &&
            <li>[ <NavLink to='/login'>login</NavLink> ]</li>
          }
          {isAuthenticated &&
            <li>[ <NavLink to={`/user/${user.username}`}>profile</NavLink> ]</li>
          }
          {isAuthenticated &&
            <LogoutButton onLogoutClick={() => dispatch(logoutUser())} />
          }
        </ul>
      </header>
    </div>
  );
};

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default Header;
