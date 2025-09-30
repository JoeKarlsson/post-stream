import React from 'react';
import PropTypes from 'prop-types';
import NavLink from '../navigation/NavLink';
import LogoutButton from '../auth/logout/LogoutButton';
import ErrorDisplay from '../error/ErrorDisplay';
import { logoutUser } from '../../../actions/auth/logoutActions';
import styles from './Header.module.scss';

const Header = ({ dispatch, isAuthenticated, user, errorMessage, errorCode }) => {
  const handleErrorDismiss = () => {
    // Dispatch action to clear error message
    dispatch({ type: 'CLEAR_ERROR' });
  };

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

      {errorMessage && (
        <ErrorDisplay
          error={{ error: { message: errorMessage, code: errorCode } }}
          onDismiss={handleErrorDismiss}
          showRetry={false}
          size="small"
          className={styles.headerError}
        />
      )}
    </div>
  );
};

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  errorMessage: PropTypes.string,
  errorCode: PropTypes.string,
};

export default Header;
