import React from 'react';
import { connect } from 'react-redux';
import { fetchUserData } from '../../../actions/auth/profileActions';
import PostList from './postList/PostList';
import styles from './Profile.scss';

class Profile extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    const { userName} = this.props.params;
    dispatch(fetchUserData(userName));
  };

  render() {
    const {
      posts,
    } = this.props;
    const { userName} = this.props.params;

    return (
      <div className={styles.Profile}>

        <h1>{userName}'s PostStream</h1>
        <PostList
          posts={posts}
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
