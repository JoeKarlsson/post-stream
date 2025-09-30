import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useOutletContext } from 'react-router-dom';
import { fetchUserPosts } from '../../../actions/profile/profileActions';
import { getUserProfile } from '../../../actions/user/userActions';
import PostList from './postList/PostList';
import ProfileDetails from './ProfileDetails';
import FollowButton from './followButton/FollowButton';
import styles from './Profile.module.scss';

const Profile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { isAuthenticated } = useOutletContext();
  const { profile, user } = useSelector(state => state.root);

  const { userName } = params;
  const profileData = user.get('profile').toJS();
  const posts = profile.get('posts').toJS();

  useEffect(() => {
    dispatch(fetchUserPosts(userName));
    dispatch(getUserProfile(userName));
  }, [dispatch, userName]);

  return (
    <div className={styles.Profile}>

      <h1>{userName}'s PostStream</h1>

      {profileData &&
        <div>
          <ProfileDetails profile={profileData}></ProfileDetails>
          <FollowButton user_id={profileData.user_id} />
        </div>
      }
      {isAuthenticated && profileData.user_id === userName &&
        <div>
          [ <Link to={`/user/${profileData.user_id}/edit`}>edit profile</Link> ]
        </div>
      }
      <hr />

      <PostList
        posts={posts}
      />

    </div>
  );
};

export default Profile;
