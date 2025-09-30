import React from "react";
import PropTypes from "prop-types";
import styles from "./ProfileDetails.module.scss";
import { User } from "../../../types";

const ProfileDetails = ({ profile }: { profile: User | null }) => {
  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <div>
        <h3>Profile</h3>
        <p className={styles.teal}>
          <strong>Name: </strong> {profile.user_metadata?.name || "N/A"}
        </p>
        <p className={styles.pink}>
          <strong>Email: </strong> {profile.email}
        </p>
        <p className={styles.lightGreen}>
          <strong>Nickname: </strong> {profile.nickname}
        </p>
        <p className={styles.orange}>
          <strong>Bio: </strong> {profile.user_metadata?.bio || "N/A"}
        </p>
        <p className={styles.forrestGreen}>
          <strong>Created At: </strong> {profile.created_at || "N/A"}
        </p>
      </div>
    </div>
  );
};

ProfileDetails.propTypes = {
  profile: PropTypes.object,
};

export default ProfileDetails;
