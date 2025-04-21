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
        // You could toast this here if you want to stay on the same page
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

      // Pass toast message to homepage via router state
      navigate("/", {
        state: { toastMessage: "Post created successfully!" },
      });
    } catch (error: any) {
      console.error("Error submitting post:", error?.response?.data || error);
      // Show toast immediately if post creation fails
      import("react-toastify").then(({ toast }) =>
        toast.error("Failed to create post")
      );
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
