import React from "react";
import { Link } from "react-router-dom";
import { PublicProfile } from "../../../types";
import styles from "./ProfileDetails.module.scss";

const UserLinks = ({ usernames }: { usernames: string[] }) =>
  usernames.length === 0 ? (
    <>nobody yet</>
  ) : (
    <>
      {usernames.map((name, i) => (
        <React.Fragment key={name}>
          {i > 0 && ", "}
          <Link to={`/user/${name}`}>{name}</Link>
        </React.Fragment>
      ))}
    </>
  );

const ProfileDetails = ({ profile }: { profile: PublicProfile }) => {
  const realName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");

  return (
    <dl className={styles.details}>
      {realName && (
        <>
          <dt>name</dt>
          <dd className={styles.teal}>{realName}</dd>
        </>
      )}
      <dt>bio</dt>
      <dd className={styles.orange}>{profile.bio || "no bio yet"}</dd>
      <dt>joined</dt>
      <dd className={styles.lightGreen}>
        {new Date(profile.createdAt).toLocaleDateString()}
      </dd>
      {/* PostStream shows who people follow, never follower counts */}
      <dt>follows</dt>
      <dd className={styles.forrestGreen}>
        <UserLinks usernames={profile.following} />
      </dd>
    </dl>
  );
};

export default ProfileDetails;
