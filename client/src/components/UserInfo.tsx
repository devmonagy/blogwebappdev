// src/components/UserInfo.tsx
import React from "react";

interface UserInfoProps {
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

const UserInfo: React.FC<UserInfoProps> = ({
  username,
  email,
  firstName,
  lastName,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 text-gray-300">Username:</label>
        <p className="text-gray-100">{username || "N/A"}</p>
      </div>
      <div>
        <label className="block mb-1 text-gray-300">First Name:</label>
        <p className="text-gray-100">{firstName || "N/A"}</p>
      </div>
      <div>
        <label className="block mb-1 text-gray-300">Last Name:</label>
        <p className="text-gray-100">{lastName || "N/A"}</p>
      </div>
      <div>
        <label className="block mb-1 text-gray-300">Email:</label>
        <p className="text-gray-100">{email || "N/A"}</p>
      </div>
    </div>
  );
};

export default UserInfo;
