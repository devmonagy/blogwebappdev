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
    <div className="flex flex-col items-center justify-center min-h-full py-10 bg-background text-white w-full overflow-hidden">
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
      <h2 className="text-2xl font-bold mb-2">
        Welcome, {firstName || "User"}!
      </h2>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => navigate("/edit-profile")}
          className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded"
        >
          Edit Profile
        </button>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded"
        >
          Logout
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-2 mt-4 text-left w-full max-w-lg px-4 sm:px-0">
        {editingPost ? "Edit Post" : "Start a new post:"}
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
  );
};

export default Dashboard;
