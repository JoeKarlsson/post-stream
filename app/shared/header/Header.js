import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavLink from '../navigation/NavLink';
import styles from './Header.scss';
import { fetchLogout } from './../../actions/logoutActions';

class Header extends Component {

  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    const { dispatch } = this.props;
    dispatch(fetchLogout())
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      <div>
        <header className={styles.header_bar}>
          <NavLink to='/' onlyActiveOnIndex={true} className={styles.header_logo}>PostStream</NavLink>
          <ul className={styles.header_nav}>
            <li><NavLink to='/about'>about</NavLink></li>
            { isLoggedIn === false &&
              <span>
                <li><NavLink to='/register'>register</NavLink></li>
                <li><NavLink to='/login'>login</NavLink></li>
              </span>
            }
            { isLoggedIn === true &&
              <span>
                <li><NavLink to='/logout' onClick={ this.handleLogout }>logout</NavLink></li>
              </span>
            }
          </ul>
        </header>
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


