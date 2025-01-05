import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserEdit, FaRegEdit, FaSignOutAlt } from "react-icons/fa";
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
    <div className="container p-4">
      <div className="flex flex-col items-center justify-center min-h-full py-10 bg-background text-white w-full overflow-x-hidden">
        {/* Header */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row sm:justify-between mb-8">
          {/* Avatar and Welcome Message */}
          <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
            <div className="flex items-center justify-start sm:justify-center w-full sm:w-auto">
              {/* Profile Picture */}
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-lg">
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
              {/* Welcome Message and Toolbar */}
              <div className="ml-4 sm:ml-6 text-left flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-primaryText">
                  Welcome, {firstName || "User"}!
                </h2>
                {/* Toolbar: Inline below Welcome Message */}
                <div className="inline-flex space-x-4 mt-2 bg-[#f9f9f9] p-2 sm:p-3 rounded-lg shadow-lg items-center">
                  <div
                    className="flex items-center text-black text-sm cursor-pointer hover:text-blue-500 transition-transform transform hover:scale-110"
                    onClick={() => navigate("/edit-profile")}
                  >
                    <FaUserEdit className="w-4 h-4 sm:w-3 sm:h-3" />
                    <span className="ml-1 sm:ml-2">Profile</span>
                  </div>
                  <div
                    className="flex items-center text-black text-sm cursor-pointer hover:text-green-500 transition-transform transform hover:scale-110"
                    onClick={() => navigate("/write-post")}
                  >
                    <FaRegEdit className="w-4 h-4 sm:w-3 sm:h-3" />
                    <span className="ml-1 sm:ml-2">Post</span>
                  </div>
                  <div
                    className="flex items-center text-black text-sm cursor-pointer hover:text-red-500 transition-transform transform hover:scale-110"
                    onClick={onLogout}
                  >
                    <FaSignOutAlt className="w-4 h-4 sm:w-3 sm:h-3" />
                    <span className="ml-1 sm:ml-2">Logout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="w-full max-w-4xl bg-cardBackground rounded-lg shadow-lg p-6 mx-auto">
        <h3 className="text-md font-semibold mb-4 text-primaryText">
          Your Recent Activity
        </h3>
        <div className="text-center text-gray-400">No recent posts yet.</div>
      </div>
    </div>
  );
};

export default Dashboard;
