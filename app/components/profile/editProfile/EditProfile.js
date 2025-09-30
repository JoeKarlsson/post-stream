import React from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import EditForm from './editForm/EditForm';
import styles from './EditProfile.scss';

class EditProfileComponent extends React.Component {
  render() {
    const {
      profile,
      dispatch,
    } = this.props;
    const { userName } = this.props.params;

    return (
      <div className={styles.Profile}>
        <h1>{userName}'s PostStream</h1>
        <EditForm
          profile={profile}
          dispatch={dispatch}
        />
        [ <Link to={`/user/${profile.user_id}`}>back</Link> ]
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  const { profile } = state.root;

  return {
    profile: profile.get('profile').toJS(),
  }
};

const ConnectedEditProfile = connect(mapStateToProps)(EditProfileComponent);

const EditProfile = () => {
  const params = useParams();

  return <ConnectedEditProfile params={params} />;
};

export default EditProfile;
