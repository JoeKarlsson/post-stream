import { useDispatch } from "react-redux";
import { setFollowing } from "../../../../slices/profileSlice";
import { AppDispatch } from "../../../../slices";
import { PublicProfile } from "../../../../types";
import TextButton from "../../../shared/textButton/TextButton";

interface FollowButtonProps {
  profile: PublicProfile;
  myUsername: string;
}

const FollowButton = ({ profile, myUsername }: FollowButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isFollowing = profile.followers.includes(myUsername);

  return (
    <p>
      <TextButton
        onClick={() =>
          dispatch(setFollowing({ username: profile.username, follow: !isFollowing, myUsername }))
        }
      >
        {isFollowing ? "unfollow" : "follow"}
      </TextButton>
    </p>
  );
};

export default FollowButton;
