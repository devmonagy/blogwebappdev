import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

interface DashboardProps {
  onLogout: () => void;
}

interface UserProfileResponse {
  firstName: string;
  profilePicture: string;
}

interface PostData {
  title: string;
  category: string;
  content: string;
  image: File | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [postData, setPostData] = useState<PostData>({
    title: "",
    category: "",
    content: "",
    image: null,
  });

  const navigate = useNavigate(); // Initialize the useNavigate hook

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPostData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPostData((prevData) => ({ ...prevData, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("category", postData.category);
    formData.append("content", postData.content);
    if (postData.image) {
      formData.append("image", postData.image);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated");
        return;
      }

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
      setPostData({ title: "", category: "", content: "", image: null });
    } catch (error: any) {
      console.error("Error submitting post:", error?.response?.data || error);
      alert("Failed to create post");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
          onClick={() => navigate("/edit-profile")} // Navigate to edit profile page
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
        Start a new post:
      </h3>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 px-4 sm:px-0"
      >
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          onChange={handleChange}
          value={postData.title}
          required
          className="w-full px-3 py-2 border rounded text-black"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          value={postData.category}
          required
          className="w-full px-3 py-2 border rounded text-black"
        />
        <textarea
          name="content"
          placeholder="Post Content"
          onChange={handleChange}
          value={postData.content}
          required
          className="w-full px-3 py-2 border rounded text-black"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="block text-white"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
