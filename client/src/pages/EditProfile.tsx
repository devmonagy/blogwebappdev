// src/pages/EditProfile.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserInfo from "../components/UserInfo";
import UpdateProfileForm from "../components/UpdateProfileForm";

interface UserInfoData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

const EditProfile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfoData | null>(null);

  // Function to fetch user data from the backend
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User is not authenticated.");
        return;
      }

      // Fetch user data from the backend
      const response = await axios.get<UserInfoData>(
        `${process.env.REACT_APP_BACKEND_URL}/auth/user-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set the user data in state and update localStorage
      const { username, email, firstName, lastName } = response.data;
      const userData = { username, email, firstName, lastName };
      setUserInfo(userData);
      localStorage.setItem("userInfo", JSON.stringify(userData));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Effect to load user data when the component mounts
  useEffect(() => {
    // Load from localStorage first
    const cachedUserInfo = localStorage.getItem("userInfo");
    if (cachedUserInfo) {
      setUserInfo(JSON.parse(cachedUserInfo));
    } else {
      fetchUserData(); // Fetch from backend if not cached
    }
  }, []);

  const handleUpdate = (email: string, firstName: string, lastName: string) => {
    if (userInfo) {
      const updatedUserInfo = { ...userInfo, email, firstName, lastName };
      setUserInfo(updatedUserInfo);
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-10 bg-background text-white">
      <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>
      <div className="flex flex-wrap justify-around w-full max-w-4xl">
        {/* User Info Component */}
        <div className="w-full md:w-1/2 p-4">
          <UserInfo
            username={userInfo?.username || "N/A"}
            email={userInfo?.email || "N/A"}
            firstName={userInfo?.firstName || "N/A"}
            lastName={userInfo?.lastName || "N/A"}
          />
        </div>
        {/* Update Profile Form Component */}
        <div className="w-full md:w-1/2 p-4">
          <UpdateProfileForm
            initialEmail={userInfo?.email || ""}
            initialFirstName={userInfo?.firstName || ""}
            initialLastName={userInfo?.lastName || ""}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
