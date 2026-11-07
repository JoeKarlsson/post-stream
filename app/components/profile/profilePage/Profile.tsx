import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchProfile } from "../../../slices/profileSlice";
import { fetchPosts } from "../../../slices/postSlice";
import { AppDispatch, RootState } from "../../../slices";
import PostList from "../../posts/postList/PostList";
import ProfileDetails from "./ProfileDetails";
import FollowButton from "./followButton/FollowButton";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userName = "" } = useParams();
  const { profile, isFetching, errorMessage } = useSelector(
    (state: RootState) => state.profile
  );
  const me = useSelector((state: RootState) => state.user.profile);
  const posts = useSelector((state: RootState) => state.post.posts);

  useEffect(() => {
    dispatch(fetchProfile(userName));
    dispatch(fetchPosts(userName));
  }, [dispatch, userName]);

  const isMe = me?.username === userName;
  const isLoaded = profile?.username === userName;

  return (
    <div>
      <title>{`${userName} · PostStream`}</title>
      <h1>{userName}</h1>

      {errorMessage && !isLoaded && <p role="alert">{errorMessage}</p>}
      {isFetching && !isLoaded && <p>loading profile...</p>}

      {isLoaded && (
        <>
          <ProfileDetails profile={profile} />
          {me && !isMe && <FollowButton profile={profile} myUsername={me.username} />}
          {isMe && (
            <p>
              [ <Link to={`/user/${userName}/edit`}>edit profile</Link> ]
            </p>
          )}
        </>
      )}
      <hr />

      {/* Wait for the profile so the posts don't jump down when it arrives */}
      {isLoaded && <PostList posts={posts} username={userName} />}
    </div>
  );
};

export default Profile;
