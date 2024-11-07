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

  // Function to fetch the latest user data from the backend
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User is not authenticated.");
        return;
      }

      const response = await axios.get<UserInfoData>(
        `${process.env.REACT_APP_BACKEND_URL}/auth/user-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set the user data in state
      const { username, email, firstName, lastName } = response.data;
      setUserInfo({ username, email, firstName, lastName });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle update and refetch data
  const handleUpdate = async (
    email: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User is not authenticated.");
        return;
      }

      // Make the update request
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/update-profile`,
        { email, firstName, lastName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refetch the updated user data from the backend
      fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
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
