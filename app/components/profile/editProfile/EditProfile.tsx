import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { updateProfile } from "../../../slices/profileSlice";
import { AppDispatch, RootState } from "../../../slices";
import TextButton from "../../shared/textButton/TextButton";
import styles from "./EditProfile.module.scss";

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userName = "" } = useParams();
  const me = useSelector((state: RootState) => state.user.profile);
  const { isSaving, errorMessage } = useSelector((state: RootState) => state.profile);
  const [fields, setFields] = useState({
    first_name: me?.first_name ?? "",
    last_name: me?.last_name ?? "",
    bio: me?.bio ?? "",
  });

  // Only the logged-in user can edit, and only their own profile
  if (!me || me.username !== userName) {
    return <Navigate to={`/user/${userName}`} replace />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(fields));
    if (updateProfile.fulfilled.match(result)) {
      navigate(`/user/${userName}`);
    }
  };

  return (
    <div>
      <h1>edit profile</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="first_name">first name</label>
        <input id="first_name" name="first_name" type="text" value={fields.first_name} onChange={handleChange} />

        <label htmlFor="last_name">last name</label>
        <input id="last_name" name="last_name" type="text" value={fields.last_name} onChange={handleChange} />

        <label htmlFor="bio">bio</label>
        <textarea id="bio" name="bio" rows={4} value={fields.bio} onChange={handleChange} />

        {errorMessage && <p role="alert">{errorMessage}</p>}

        <p>
          <TextButton type="submit" disabled={isSaving}>
            {isSaving ? "saving..." : "save"}
          </TextButton>
          [ <Link to={`/user/${userName}`}>cancel</Link> ]
        </p>
      </form>
    </div>
  );
};

export default EditProfile;
