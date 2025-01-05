import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostForm from "../components/PostForm"; // Assuming PostForm is reusable

const WritePost: React.FC = () => {
  const navigate = useNavigate();

  const handlePostSubmit = async (formData: FormData) => {
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
      navigate("/");
    } catch (error: any) {
      console.error("Error submitting post:", error?.response?.data || error);
      alert("Failed to create post");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-10 bg-background text-white w-full px-4">
      <h1 className="text-3xl font-bold mb-6 text-primaryText">
        Start Your Post
      </h1>
      <div className="w-full max-w-4xl bg-cardBackground rounded-lg shadow-lg p-6">
        <PostForm
          initialData={{ title: "", category: "", content: "", image: null }}
          onSubmit={handlePostSubmit}
        />
      </div>
    </div>
  );
};

export default WritePost;
