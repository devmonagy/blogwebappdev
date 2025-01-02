import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PostForm from "../components/PostForm"; // Import the PostForm component
import "react-quill/dist/quill.snow.css"; // Import Quill styles

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

  const handlePostSubmit = async (formData: FormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      if (editingPost?._id) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${editingPost._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Post updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/posts/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Post created successfully");
      }

      navigate("/");
    } catch (error: any) {
      console.error("Error submitting post:", error?.response?.data || error);
      alert("Failed to create or update post");
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
        </div>
      </div>

      {/* Create/Edit Post */}
      <div className="w-full max-w-4xl bg-cardBackground rounded-lg shadow-lg p-6 mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-primaryText">
          {editingPost ? "Edit Post" : "Start a New Post:"}
        </h3>
        <PostForm
          initialData={{
            title: editingPost?.title || "",
            category: editingPost?.category || "",
            content: editingPost?.content || "",
            image: null,
          }}
          onSubmit={handlePostSubmit}
        />
      </div>
    </div>
  );
};

export default Dashboard;
