import React, { PropTypes as T } from 'react'

export class ProfileDetails extends React.Component {
  static propTypes = {
    profile: T.object
  }

  render(){
    const { profile } = this.props;
    const { address } = profile.user_metadata || {} // new address field
    const { bio } = profile.user_metadata || {} // new bio field

    return (
      <div>
        <img src={profile.picture}/>
        <div>
          <h3>Profile</h3>
          <p><strong>Name: </strong> {profile.name}</p>
          <p><strong>Email: </strong> {profile.email}</p>
          <p><strong>Nickname: </strong> {profile.nickname}</p>
          <p><strong>Address: </strong> {address}</p>
          <p><strong>Bio: </strong> {bio}</p>
          <p><strong>Created At: </strong> {profile.created_at}</p>
          <p><strong>Updated At: </strong> {profile.updated_at}</p>
        </div>
      </div>
    )
  }
}

export default ProfileDetails;
