// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface DashboardProps {
  onLogout: () => void;
}

interface UserProfileResponse {
  firstName: string;
  profilePicture: string; // This should be just the filename or relative path
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Fetch user data from the backend
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get<UserProfileResponse>(
        `${process.env.REACT_APP_BACKEND_URL}/auth/user-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFirstName(response.data.firstName);

      // Correctly handle the profile picture URL
      if (response.data.profilePicture) {
        const profilePicPath = response.data.profilePicture.replace(
          /^\/+|uploads\/+/g,
          ""
        ); // Remove leading slashes and ensure "uploads/" is not repeated

        const profilePicUrl = response.data.profilePicture.startsWith("http")
          ? response.data.profilePicture
          : `${process.env.REACT_APP_BACKEND_URL}/uploads/${profilePicPath}`;

        setProfilePicture(profilePicUrl);
      } else {
        setProfilePicture(null); // Handle case where no profile picture is provided
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-10 bg-background text-white">
      {/* Profile Picture */}
      <div className="w-24 h-24 rounded-full mb-4 overflow-hidden">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>

      {/* Welcome Message */}
      <h2 className="text-2xl font-bold mb-2">
        Welcome, {firstName || "User"}!
      </h2>

      {/* Edit Profile Link */}
      <Link to="/edit-profile" className="text-blue-400 hover:underline mb-4">
        Edit Profile
      </Link>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
