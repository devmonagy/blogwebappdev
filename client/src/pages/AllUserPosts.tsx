import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserPost {
  _id: string;
  title: string;
  createdAt: string; // Include createdAt field for sorting
}

const AllUserPosts: React.FC = () => {
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const navigate = useNavigate();

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get<UserPost[]>(
        `${process.env.REACT_APP_BACKEND_URL}/posts/user-posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Sort posts by newest first (descending order of `createdAt`)
      const sortedPosts = response.data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setUserPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-6">All Your Posts</h1>
      <ul className="space-y-4">
        {userPosts.map((post) => (
          <li
            key={post._id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
          >
            <span>{post.title}</span>
            <button
              className="text-blue-500 hover:underline"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllUserPosts;
