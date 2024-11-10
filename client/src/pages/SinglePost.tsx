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

interface ValidateTokenResponse {
  user: {
    _id: string;
  };
}

const SinglePost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post<ValidateTokenResponse>(
          `${process.env.REACT_APP_BACKEND_URL}/auth/validate-token`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          setUserId(response.data.user._id);
        })
        .catch((error) => {
          console.error("Error validating token:", error);
          setError("Failed to validate user.");
        });
    }
  }, []);

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

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleEdit = () => {
    if (post) {
      navigate("/dashboard", { state: { post } });
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated.");
        return;
      }

      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post deleted successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete the post.");
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
      {userId === post.author._id && (
        <div className="mt-4">
          <button
            onClick={handleEdit}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Edit Post
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
