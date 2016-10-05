import React from 'react';
import { connect } from 'react-redux';
import { fetchUserPosts } from '../../actions/profile/profileActions';
import PostList from './postList/PostList';
import ProfileEdit from './ProfileEdit';
import ProfileDetails from './ProfileDetails';
import styles from './Profile.scss';

class Profile extends React.Component {
  constructor(props, context) {
    super();

    // props.auth.on('profile_updated', (newProfile) => {
    //   this.setState({ profile: newProfile })
    // })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const profile = JSON.parse(localStorage.getItem('profile'));
    dispatch(fetchUserPosts(profile.user_id));
  };

  render() {
    const {
      posts,
    } = this.props;
    const profile = JSON.parse(localStorage.getItem('profile'));

    return (
      <div className={ styles.Profile }>

        <h1>{ profile.nickname }'s PostStream</h1>

        <ProfileDetails profile={ profile }></ProfileDetails>

        <ProfileEdit profile={ profile } ></ProfileEdit>

        <PostList
          posts={ posts }
        />

      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    posts: state.root.profile.get('posts').toJS(),
  }
};

export default connect(
  mapStateToProps
)(Profile);
