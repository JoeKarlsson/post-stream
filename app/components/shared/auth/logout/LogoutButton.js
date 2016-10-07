import React, { Component, PropTypes } from 'react'

class Logout extends Component {

  render() {
    const { onLogoutClick } = this.props

    return (
      <li>[ <span onClick={() => onLogoutClick()}>logout</span> ]</li>
    )
  }

}

Logout.propTypes = {
  onLogoutClick: PropTypes.func.isRequired
}

export default Logout;