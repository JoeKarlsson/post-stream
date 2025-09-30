import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  updateProfile,
  onFormChange,
} from '../../../../actions/profile/updateProfileActions';

const EditForm = ({ profile }) => {
  const dispatch = useDispatch();
  const addressRef = useRef();
  const bioRef = useRef();

  const handleChange = (e) => {
    dispatch(onFormChange(e.target.id, e.target.value));
  };

  // method trigged when edit form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    const { user_metadata } = profile;

    const metadata = {
      user_metadata: {
        address: addressRef.current.value,
        bio: bioRef.current.value,
        ...user_metadata,
      }
    };
    dispatch(updateProfile(profile.user_id, metadata));
  };

  const { address } = profile.user_metadata || {};
  const { bio } = profile.user_metadata || {};

  return (
    <div>
      <h3>Editing Profile</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor='address'>address</label>
        <input
          ref={addressRef}
          type='text'
          id='address'
          className='u-full-width'
          placeholder='address'
          value={address}
          onChange={handleChange}
        />
        <label htmlFor='bio'>bio</label>
        <input
          ref={bioRef}
          type='text'
          id='bio'
          className='u-full-width'
          placeholder='bio'
          value={bio}
          onChange={handleChange}
        />
        <div>
          <button type='submit'>save</button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
