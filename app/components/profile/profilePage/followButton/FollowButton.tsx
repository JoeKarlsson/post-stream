import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { followUser } from "../../../../actions/profile/updateProfileActions";
import { RootState } from "../../../../slices";

interface FollowButtonProps {
  user_id: number;
}

const FollowButton: React.FC<FollowButtonProps> = ({ user_id }) => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (!profile) return;

    const user_metadata = profile.user_metadata || {};
    const followings = ((user_metadata as any).following as number[]) || [];
    if (followings.indexOf(user_id) === -1) {
      followings.push(user_id);
    }
    const metadata = {
      user_metadata: {
        following: followings,
        ...user_metadata,
      },
    };
    dispatch(followUser(profile, metadata) as any);
  };

  return (
    <div>
      {profile?.id !== user_id && (
        <div>
          [{" "}
          <span
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleClick(e as unknown as React.MouseEvent<HTMLSpanElement>)
            }
          >
            follow
          </span>{" "}
          ]
        </div>
      )}
    </div>
  );
};

export default FollowButton;
