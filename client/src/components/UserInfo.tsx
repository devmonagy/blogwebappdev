import React from "react";

interface UserInfoProps {
  username: string | null;
  email: string | null;
}

const UserInfo: React.FC<UserInfoProps> = ({ username, email }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 text-gray-300">Username:</label>
        <p className="text-gray-100">{username || "N/A"}</p>
      </div>
      <div>
        <label className="block mb-1 text-gray-300">Email:</label>
        <p className="text-gray-100">{email || "N/A"}</p>
      </div>
    </div>
  );
};

export default UserInfo;
