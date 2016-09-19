import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavLink from '../navigation/NavLink';
import AuthService from '../auth/AuthService'
import styles from './Header.scss';
import { fetchLogout } from './../../actions/auth/logoutActions';

class Header extends Component {

  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(){
    this.props.auth.logout()
    this.context.router.push('/login');
  }

  render() {
    const { loggedIn } = this.props.auth;
    const isLoggedIn = loggedIn();
    console.log('isLoggedIn: ', isLoggedIn);

    return (
      <div>
        <header className={styles.header_bar}>
          <NavLink to='/' onlyActiveOnIndex={true} className={styles.header_logo}>PostStream</NavLink>
          <ul className={styles.header_nav}>
            <li>[ <NavLink to='/about'>?</NavLink> ]</li>
            { isLoggedIn === false &&
              <li>[ <NavLink to='/register'>register</NavLink> ]</li>
            }
            { isLoggedIn === false &&
              <li>[ <NavLink to='/login'>login</NavLink> ]</li>
            }
            { isLoggedIn === true &&
              <span>
                <li>[ <NavLink to='/logout' onClick={ this.handleLogout }>logout</NavLink> ]</li>
              </span>
            }
          </ul>
        </header>
        <hr/>
      </div>
    )
  }
}

Header.propTypes = {

};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.rootReducer.authReducer.get('isLoggedIn'),
  }
};

export default connect(
  mapStateToProps
)(Header);


