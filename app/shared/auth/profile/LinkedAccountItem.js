import React, { PropTypes as T } from 'react';
import AuthService from '../AuthService';

export class LinkedAccountItem extends React.Component {
  static propTypes = {
    auth: T.instanceOf(AuthService),
    profile: T.object,
    identity: T.object
  }

  unlink(identity){
    // shows a basic confirmation window, and calls auth0 unlink api
    if (window.confirm(`Are you sure you want to unlink ${identity.connection}?`)) {
      this.props.auth.unlinkAccount(identity)
    }
  }

  renderUnlink(){
    // renders the unlink button, excluding the main identify row, which cannot be removed
    console.log('hit: ');
    const { profile, identity } = this.props
    if (profile.user_id != identity.provider + '|' + identity.user_id){
      return (
        <button
          onClick={this.unlink.bind(this, identity)}
        >
          unlink
        </button>
      )
    }
  }

  render(){
    const { identity } = this.props
    const profileName = identity.profileData ? identity.profileData.name : 'Main'

    return (
      <div>
        <h3>{profileName}</h3>
        <ul>
          <li>
            {identity.connection}
            {this.renderUnlink()}
          </li>
        </ul>
      </div>
    )
  }
}

export default LinkedAccountItem;