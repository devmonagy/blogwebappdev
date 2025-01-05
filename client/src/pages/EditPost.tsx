import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PostForm from "../components/PostForm"; // Assuming this is a reusable form component

interface Post {
  _id: string;
  title: string;
  category: string;
  content: string;
  imagePath: string;
}

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get<Post>(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${id}`
        );
        setPost(response.data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post for editing.");
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handlePostUpdate = async (formData: FormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Post updated successfully");
      navigate(`/post/${id}`);
    } catch (error: any) {
      console.error("Error updating post:", error?.response?.data || error);
      alert("Failed to update post");
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!post) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-10 bg-background text-white w-full px-4">
      <h1 className="text-3xl font-bold mb-6 text-primaryText">Edit Post</h1>
      <div className="w-full max-w-4xl bg-cardBackground rounded-lg shadow-lg p-6">
        <PostForm
          initialData={{
            title: post.title,
            category: post.category,
            content: post.content,
            image: null, // Allow user to upload a new image
          }}
          onSubmit={handlePostUpdate}
        />
      </div>
    </div>
  );
};

export default EditPost;
