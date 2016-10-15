import React, { PropTypes as T } from 'react';
import styles from './ProfileDetails.scss';

export class ProfileDetails extends React.Component {
  static propTypes = {
    profile: T.object
  }

  render(){
    const { profile } = this.props;
    const { address, bio, following } = profile.user_metadata || {};

    return (
      <div>
        <img src={ profile.picture }/>
        <div>
          <h3>Profile</h3>
          <p className={ styles.teal }><strong>Name: </strong> { profile.name }</p>
          <p className={ styles.pink }><strong>Email: </strong> { profile.email }</p>
          <p className={ styles.lightGreen }><strong>Nickname: </strong> { profile.nickname }</p>
          <p className={ styles.purple }><strong>Address: </strong> { address }</p>
          <p className={ styles.orange }><strong>Bio: </strong> { bio }</p>
          <p className={ styles.red }><strong>Following: </strong> { following }</p>
          <p className={ styles.forrestGreen }><strong>Created At: </strong> { profile.created_at }</p>
        </div>
      </div>
    )
  }
}

export default ProfileDetails;
