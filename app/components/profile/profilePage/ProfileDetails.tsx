import React from "react";
import { Link } from "react-router-dom";
import { PublicProfile } from "../../../types";
import { authorColor } from "../../../utils/authorColor";
import { formatTimestamp } from "../../../utils/plainText";
import styles from "./ProfileDetails.module.scss";
import colors from "../../shared/styles/authorColors.module.scss";

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

// Laid out like the output of the Unix `finger` command
const ProfileDetails = ({ profile }: { profile: PublicProfile }) => {
  const realName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");

  return (
    <dl className={styles.finger}>
      <dt>Login:</dt>
      <dd className={colors[authorColor(profile.username)]}>{profile.username}</dd>
      <dt>Name:</dt>
      <dd>{realName || "-"}</dd>
      <dt>Joined:</dt>
      <dd>{formatTimestamp(profile.createdAt).slice(0, 10)}</dd>
      {/* PostStream shows who people follow, never follower counts */}
      <dt>Follows:</dt>
      <dd>
        <UserLinks usernames={profile.following} />
      </dd>
      <dt className={styles.plan}>Plan:</dt>
      <dd className={styles.plan}>{profile.bio || "No Plan."}</dd>
    </dl>
  );
};

export default ProfileDetails;
