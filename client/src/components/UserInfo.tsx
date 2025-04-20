import React from "react";

interface UserInfoProps {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  memberSince: string | null;
  bio?: string | null;
}

const UserInfo: React.FC<UserInfoProps> = ({
  email,
  firstName,
  lastName,
  memberSince,
  bio,
}) => {
  const displayBio =
    bio && bio.trim().length > 0 ? bio : "No bio provided yet.";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-primaryText mb-4">
        Review Your Details
      </h3>
      <div className="space-y-3">
        {/* Email */}
        <div>
          <label className="block mb-1 text-primaryText font-bold">
            Email:
          </label>
          <p className="text-secondaryText text-xs">{email || "N/A"}</p>
        </div>

        {/* First + Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-primaryText font-bold">
              First Name:
            </label>
            <p className="text-secondaryText text-xs">{firstName || "N/A"}</p>
          </div>
          <div>
            <label className="block mb-1 text-primaryText font-bold">
              Last Name:
            </label>
            <p className="text-secondaryText text-xs">{lastName || "N/A"}</p>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1 text-primaryText font-bold">Bio:</label>
          <p className="text-secondaryText text-xs">{displayBio}</p>
        </div>

        {/* Member Since */}
        <div>
          <label className="block mb-1 text-primaryText font-bold">
            Member Since:
          </label>
          <p className="text-secondaryText text-xs">{memberSince || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
