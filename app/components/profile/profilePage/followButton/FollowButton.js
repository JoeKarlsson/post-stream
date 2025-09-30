import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  followUser,
} from '../../../../actions/profile/updateProfileActions';

const FollowButton = ({ user_id }) => {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.root.profile.get('profile').toJS());

  const handleClick = (e) => {
    e.preventDefault();
    const { user_metadata } = profile;
    const followings = user_metadata.following || [];
    if (followings.indexOf(user_id) === -1) {
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

  return (
    <div>
      {profile.user_id !== user_id &&
        <div>
          [ <span onClick={handleClick}>follow</span> ]
        </div>
      }
    </div>
  );
};

export default FollowButton;
