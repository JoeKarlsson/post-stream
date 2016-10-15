import React, { Component, PropTypes } from 'react'
import styles from './LogoutButton.scss';

class Logout extends Component {

  render() {
    const { onLogoutClick } = this.props

    return (
      <li>[ <span className={styles.logoutButton} onClick={() => onLogoutClick()}>logout</span> ]</li>
    )
  }

}

Logout.propTypes = {
  onLogoutClick: PropTypes.func.isRequired
}

export default Logout;