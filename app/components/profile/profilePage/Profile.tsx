import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useOutletContext } from "react-router-dom";
import { fetchUserPosts } from "../../../actions/profile/profileActions";
import { getUserProfile } from "../../../actions/user/userActions";
import PostList from "./postList/PostList";
import ProfileDetails from "./ProfileDetails";
import FollowButton from "./followButton/FollowButton";
import styles from "./Profile.module.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { isAuthenticated } = useOutletContext();
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);

  const { userName } = params;
  const userJS = user.toJS();
  const profileJS = profile.toJS();
  const profileData = userJS.profile;
  const posts = profileJS.posts;

  useEffect(() => {
    dispatch(fetchUserPosts(userName));
    dispatch(getUserProfile(userName));
  }, [dispatch, userName]);

  return (
    <div className={styles.Profile}>
      <h1>{userName}'s PostStream</h1>

      {profileData && (
        <div>
          <ProfileDetails profile={profileData}></ProfileDetails>
          <FollowButton user_id={profileData.id} />
        </div>
      )}
      {isAuthenticated && profileData.id === userName && (
        <div>
          [ <Link to={`/user/${profileData.id}/edit`}>edit profile</Link> ]
        </div>
      )}
      <hr />

      <PostList posts={posts} />
    </div>
  );
};

export default Profile;
