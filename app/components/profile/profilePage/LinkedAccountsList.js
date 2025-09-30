import React from 'react';
import PropTypes from 'prop-types';
import LinkedAccountItem from './LinkedAccountItem'
import AuthService from '../AuthService';
import LinkAccountService from '../LinkAccountService'

export class LinkedAccountsList extends React.Component {
  static propTypes = {
    auth: PropTypes.instanceOf(AuthService),
    profile: PropTypes.object
  }

  render() {
    const { profile, auth } = this.props;
    const linker = new LinkAccountService(auth); // initializing the new helper
    let items = []
    if (profile && profile.identities) {
      items = profile.identities.map((identity, i) => {
        return (<LinkedAccountItem {...this.props} identity={identity} key={i} />)
      })
    }

    return (
      <div>
        <h3>Linked Accounts</h3>
        <div>{items}</div>
        <button onClick={linker.link}>Link Account</button>
      </div>
    )
  }
}

export default LinkedAccountsList;
