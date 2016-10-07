import React from 'react';
import { connect } from 'react-redux';
import { fetchUserPosts } from '../../../actions/profile/profileActions';
import PostList from './postList/PostList';
import ProfileDetails from './ProfileDetails';
import styles from './Profile.scss';

class Profile extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const { userName} = this.props.params;
    dispatch(fetchUserPosts(userName));
  };

  render() {
    const {
      posts,
      isAuthenticated,
      profile,
      dispatch
    } = this.props;
    const { userName} = this.props.params;

    return (
      <div className={ styles.Profile }>

        <h1>{ userName }'s PostStream</h1>

        { isAuthenticated &&
          <div>
            <ProfileDetails profile={ profile }></ProfileDetails>
          </div>
        }

        <PostList
          posts={ posts }
        />

      </div>
    );
  }
};

const mapStateToProps = (state) => {
  const { auth, profile } = state.root;

  return {
    isAuthenticated: auth.get('isAuthenticated'),
    profile: profile.get('profile').toJS(),
    posts: profile.get('posts').toJS(),
  }
};

export default connect(
  mapStateToProps
)(Profile);
