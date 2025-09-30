import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import EditForm from './editForm/EditForm';
import styles from './EditProfile.module.scss';

const EditProfile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const profile = useSelector(state => state.root.profile.get('profile').toJS());

  const { userName } = params;

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
};

export default EditProfile;
