import React, { useEffect, useState } from "react";
import UserInfo from "../components/UserInfo";

interface UserInfoData {
  username: string | null;
  email: string | null;
}

const EditProfile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfoData>({
    username: null,
    email: null,
  });

  useEffect(() => {
    // Fetch user info from localStorage
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    console.log("Retrieved email:", email); // Debugging
    setUserInfo({ username, email });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-10 bg-background text-white">
      <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>
      {/* Use the UserInfo component */}
      <UserInfo username={userInfo.username} email={userInfo.email} />
    </div>
  );
};

export default EditProfile;
