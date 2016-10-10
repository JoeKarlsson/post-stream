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

    dispatch(followUser(profile, user_id));
  };

  render(){
    return (
      <div>
        [ <span onClick={(event) => this.handleClick(event)}>follow</span> ]
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
