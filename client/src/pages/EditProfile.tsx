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
  profilePicture: string;
  memberSince: string;
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

      const response = await axios.get<{
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        profilePicture: string;
        createdAt: string;
      }>(`${process.env.REACT_APP_BACKEND_URL}/auth/user-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const {
        username,
        email,
        firstName,
        lastName,
        profilePicture,
        createdAt,
      } = response.data;

      // Correctly handle the profile picture URL, matching the logic from Dashboard.tsx
      const profilePicPath = profilePicture
        ? profilePicture.replace(/^\/+|uploads\/+/g, "") // Remove leading slashes and ensure "uploads/" is not repeated
        : "default-user.png"; // Fallback to a default image if none is provided

      const fullProfilePictureUrl = profilePicture.startsWith("http")
        ? profilePicture
        : `${process.env.REACT_APP_BACKEND_URL}/uploads/${profilePicPath}`;

      // Format the memberSince date
      const parsedDate = new Date(createdAt);
      const memberSince =
        parsedDate instanceof Date && !isNaN(parsedDate.getTime())
          ? parsedDate.toLocaleDateString()
          : "N/A";

      // Update the state with fetched user data
      setUserInfo({
        username,
        email,
        firstName,
        lastName,
        profilePicture: fullProfilePictureUrl,
        memberSince,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdate = (
    email: string,
    firstName: string,
    lastName: string,
    profilePicture: string
  ) => {
    // Update the state with the new data
    setUserInfo((prev) => {
      if (prev) {
        return {
          ...prev,
          email,
          firstName,
          lastName,
          profilePicture,
        };
      }
      return null;
    });

    // Function to send the updated data to the backend
    const updateProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. User is not authenticated.");
          return;
        }

        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/auth/update-profile`,
          { email, firstName, lastName, profilePicture },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchUserData(); // Re-fetch user data to ensure it's up-to-date
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };

    updateProfile();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-10 bg-background text-white">
      <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>
      <div className="flex flex-wrap justify-around w-full max-w-4xl">
        <div className="w-full md:w-1/2 p-4">
          <UserInfo
            username={userInfo?.username || "N/A"}
            email={userInfo?.email || "N/A"}
            firstName={userInfo?.firstName || "N/A"}
            lastName={userInfo?.lastName || "N/A"}
            memberSince={userInfo?.memberSince || "N/A"}
          />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <UpdateProfileForm
            initialEmail={userInfo?.email || ""}
            initialFirstName={userInfo?.firstName || ""}
            initialLastName={userInfo?.lastName || ""}
            initialProfilePicture={userInfo?.profilePicture || ""}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
