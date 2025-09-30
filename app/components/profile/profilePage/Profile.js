import React from 'react';
import { connect } from 'react-redux';
import { Link, useParams, useOutletContext } from 'react-router-dom';
import { fetchUserPosts } from '../../../actions/profile/profileActions';
import { getUserProfile } from '../../../actions/user/userActions';
import PostList from './postList/PostList';
import ProfileDetails from './ProfileDetails';
import FollowButton from './followButton/FollowButton';
import styles from './Profile.scss';

class ProfileComponent extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const { userName } = this.props.params;
    dispatch(fetchUserPosts(userName));
    dispatch(getUserProfile(userName));
  };

  render() {
    const {
      posts,
      isAuthenticated,
      profile,
    } = this.props;
    const { userName } = this.props.params;

    return (
      <div className={styles.Profile}>

        <h1>{userName}'s PostStream</h1>

        {profile &&
          <div>
            <ProfileDetails profile={profile}></ProfileDetails>
            <FollowButton user_id={profile.user_id} />
          </div>
        }
        {isAuthenticated && profile.user_id === userName &&
          <div>
            [ <Link to={`/user/${profile.user_id}/edit`}>edit profile</Link> ]
          </div>
        }
        <hr />

        <PostList
          posts={posts}
        />

      </div>
    );
  }
};

const mapStateToProps = (state) => {
  const { profile, user } = state.root;
  return {
    isAuthenticated: profile.get('isAuthenticated'),
    profile: user.get('profile').toJS(),
    posts: profile.get('posts').toJS(),
  }
};

const ConnectedProfile = connect(mapStateToProps)(ProfileComponent);

const Profile = () => {
  const params = useParams();
  const { isAuthenticated } = useOutletContext();

  return <ConnectedProfile params={params} isAuthenticated={isAuthenticated} />;
};

export default Profile;
