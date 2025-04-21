import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostForm from "../components/PostForm";

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
    <div className="bg-white text-black min-h-screen px-6 py-12 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <PostForm
          initialData={{
            title: "",
            category: "",
            content: "",
            image: null,
          }}
          onSubmit={handlePostSubmit}
        />
      </div>
    </div>
  );
};

export default WritePost;
