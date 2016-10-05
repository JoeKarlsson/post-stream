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
    const { userName} = this.props.params;
    dispatch(fetchUserPosts(userName));
  };

  render() {
    const {
      posts,
      isAuthenticated,
    } = this.props;
    const profile = JSON.parse(localStorage.getItem('profile'));
    const { userName} = this.props.params;

    return (
      <div className={ styles.Profile }>

        <h1>{ userName }'s PostStream</h1>

        { isAuthenticated &&
          <div>
            <ProfileDetails profile={ profile }></ProfileDetails>
            <ProfileEdit profile={ profile } ></ProfileEdit>
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
  const { auth } = state.root;
  const { isAuthenticated } = auth

  return {
    isAuthenticated: auth.get('isAuthenticated'),
    posts: state.root.profile.get('posts').toJS(),
  }
};

export default connect(
  mapStateToProps
)(Profile);
