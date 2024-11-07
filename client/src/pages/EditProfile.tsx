// src/pages/EditProfile.tsx
import React, { useEffect, useState } from "react";
import UserInfo from "../components/UserInfo";
import UpdateProfileForm from "../components/UpdateProfileForm";

interface UserInfoData {
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

const EditProfile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfoData>({
    username: null,
    email: null,
    firstName: null,
    lastName: null,
  });

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const firstName = localStorage.getItem("firstName") || "";
    const lastName = localStorage.getItem("lastName") || "";

    setUserInfo({ username, email, firstName, lastName });
  }, []);

  const handleUpdate = (email: string, firstName: string, lastName: string) => {
    setUserInfo({ ...userInfo, email, firstName, lastName });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-10 bg-background text-white">
      <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>
      <div className="flex flex-wrap justify-around w-full max-w-4xl">
        {/* User Info Component */}
        <div className="w-full md:w-1/2 p-4">
          <UserInfo
            username={userInfo.username}
            email={userInfo.email}
            firstName={userInfo.firstName}
            lastName={userInfo.lastName}
          />
        </div>
        {/* Update Profile Form Component */}
        <div className="w-full md:w-1/2 p-4">
          <UpdateProfileForm
            initialEmail={userInfo.email || ""}
            initialFirstName={userInfo.firstName || ""}
            initialLastName={userInfo.lastName || ""}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
