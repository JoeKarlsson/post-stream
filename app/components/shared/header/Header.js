import React, { Component } from 'react';
import NavLink from '../navigation/NavLink';
import Login from '../auth/login/Login';
import LogoutButton from '../auth/logout/LogoutButton';
import { login } from '../../../actions/auth/localAuthActions';
import { logoutUser } from '../../../actions/auth/logoutActions';
import styles from './Header.scss';

class Header extends Component {
  render() {
    const {
      dispatch,
      isAuthenticated,
      errorMessage,
      user
    } = this.props;

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
    )
  }
}

export default Header;
