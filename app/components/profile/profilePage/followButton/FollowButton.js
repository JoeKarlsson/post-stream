import React from 'react';
import { connect } from 'react-redux';
import {
  followUser,
} from '../../../../actions/profile/updateProfileActions';

export class FollowButton extends React.Component {

  handleClick(e){
    e.preventDefault()
    const {
      profile,
      user_id,
      dispatch
    } = this.props;
    const { user_metadata } = profile;
    const followings = user_metadata.following || []
    if(followings.indexOf(user_id) === -1){
      followings.push(user_id);
    }
    const metadata = {
      user_metadata: {
        following: followings,
        ...user_metadata,
      }
    };
    dispatch(followUser(profile, metadata));
  };

  render(){
    const {
      profile,
      user_id,
      dispatch
    } = this.props;

    return (
      <div>
        { profile.user_id !== user_id &&
          <div>
            [ <span onClick={(event) => this.handleClick(event)}>follow</span> ]
          </div>
        }
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  const { profile } = state.root;

  return {
    profile: profile.get('profile').toJS(),
  }
};

export default connect(
  mapStateToProps
)(FollowButton);
