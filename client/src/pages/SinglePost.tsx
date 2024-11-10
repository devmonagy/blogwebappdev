import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Author {
  _id: string;
  firstName: string;
}

interface Post {
  _id: string;
  title: string;
  category: string;
  content: string;
  imagePath: string;
  author: Author;
}

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
}

const SinglePost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    const fetchPost = async () => {
      try {
        const response = await axios.get<Post>(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to fetch the post.");
      }
    };

    fetchUser();
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete this post.");
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post.");
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!post) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-4 text-primaryText">
      <h2 className="text-3xl font-bold mb-2">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-4">
        Category: {post.category} | Author: {post.author.firstName}
      </p>
      {post.imagePath && (
        <img
          src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.imagePath}`}
          alt={post.title}
          className="w-full h-64 object-cover mb-4 rounded"
        />
      )}
      <p className="text-base">{post.content}</p>

      {/* Show the delete button only if the logged-in user is the author */}
      {user && post.author._id === user._id && (
        <button
          onClick={handleDelete}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Delete Post
        </button>
      )}
    </div>
  );
};

export default SinglePost;
