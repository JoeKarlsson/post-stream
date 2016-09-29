import React from 'react';
import { connect } from 'react-redux';
import { fetchUserData } from '../../actions/auth/profileActions';
import PostList from './postList/PostList';
import ProfileEdit from './ProfileEdit';
import ProfileDetails from './ProfileDetails';
import styles from './Profile.scss';

class Profile extends React.Component {
  constructor(props, context) {
    super();
    this.state = {
      profile: props.auth.getProfile()
    }
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({ profile: newProfile })
    })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { getProfile } = this.props.auth;
    const profile = getProfile();
    dispatch(fetchUserData(profile.user_id));
  };

  render() {
    const {
      posts,
    } = this.props;
    const { userName} = this.props.params;
    const profile = this.props.auth.getProfile();

    return (
      <div className={ styles.Profile }>

        <h1>{ userName }'s PostStream</h1>

        <ProfileDetails profile={ profile }></ProfileDetails>

        <ProfileEdit profile={ profile } auth={ this.props.auth }></ProfileEdit>

        <PostList
          posts={ posts }
        />

      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    posts: state.rootReducer.authReducer.get('posts').toJS(),
  }
};

export default connect(
  mapStateToProps
)(Profile);
