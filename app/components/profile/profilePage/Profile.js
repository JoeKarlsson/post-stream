import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
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
    } = this.props;
    const { userName} = this.props.params;

    return (
      <div className={ styles.Profile }>

        <h1>{ userName }'s PostStream</h1>

        { isAuthenticated &&
          <div>
            <ProfileDetails profile={ profile }></ProfileDetails>
            [ <Link to={`/user/${ profile.user_id }/edit`}>edit profile</Link> ]
            <hr />
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
  const { profile } = state.root;
  console.log('profile.toJS(): ', profile.toJS());
  return {
    isAuthenticated: profile.get('isAuthenticated'),
    profile: profile.get('profile').toJS(),
    posts: profile.get('posts').toJS(),
  }
};

export default connect(
  mapStateToProps
)(Profile);
