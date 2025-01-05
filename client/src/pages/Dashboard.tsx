import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

interface DashboardProps {
  onLogout: () => void;
}

interface UserProfileResponse {
  firstName: string;
  profilePicture: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const editingPost = location.state?.post;

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
      handleProfilePicture(response.data.profilePicture);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleProfilePicture = (path: string) => {
    if (path) {
      const profilePicUrl = path.startsWith("http")
        ? path
        : `${process.env.REACT_APP_BACKEND_URL}/uploads/${path.replace(
            /^\/+|uploads\/+/g,
            ""
          )}`;
      setProfilePicture(profilePicUrl);
    } else {
      setProfilePicture(null);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [editingPost]);

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-10 bg-background text-white w-full px-4 overflow-x-hidden">
      {/* Header */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between mb-8">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg mb-4 sm:mb-0">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-700">
              No Image
            </div>
          )}
        </div>

        {/* Welcome Message */}
        <div className="flex-1 ml-0 sm:ml-6 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-primaryText">
            Welcome, {firstName || "User"}!
          </h2>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
          <button
            onClick={() => navigate("/edit-profile")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out"
          >
            Edit Profile
          </button>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out"
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/write-post")}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out"
          >
            Start Writing
          </button>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="w-full max-w-4xl bg-cardBackground rounded-lg shadow-lg p-6 mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-primaryText">
          Your Recent Activity
        </h3>
        {/* Placeholder for user posts */}
        <div className="text-center text-gray-400">
          {/* Render user's recent posts here */}
          No recent posts yet.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
