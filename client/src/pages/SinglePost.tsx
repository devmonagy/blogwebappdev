import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import "../styles/quill-custom.css";

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
          setIsAuthenticated(true);
        })
        .catch(() => setError("Failed to validate user."));
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get<Post>(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${id}`
        );
        setPost(response.data);
      } catch {
        setError("Failed to fetch the post.");
      }
    };
    fetchPost();
  }, [id]);

  const handleEdit = () => {
    if (post) navigate(`/edit-post/${post._id}`);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setError("User is not authenticated.");

      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post deleted successfully.");
      navigate("/");
    } catch {
      setError("Failed to delete the post.");
    }
  };

  const showFirstFewLines = (content: string, limit: number) => {
    const sanitizedContent = DOMPurify.sanitize(content);
    const visibleContent = sanitizedContent.substring(0, limit);
    const remainingContent = sanitizedContent.substring(limit);

    return (
      <div>
        <div
          className={isAuthenticated ? "" : "relative fade-text"}
          dangerouslySetInnerHTML={{
            __html: isAuthenticated ? sanitizedContent : visibleContent,
          }}
        />
        {!isAuthenticated && remainingContent && (
          <div className="relative mt-4">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            <div className="z-20 text-center text-primaryText relative py-10 font-black">
              <p>
                Please{" "}
                <a href="/login" className="text-blue-500 underline">
                  Login
                </a>{" "}
                to read the full post. <br />
                Not a member?{" "}
                <a href="/register" className="text-blue-500 underline">
                  Register
                </a>{" "}
                for free access!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (error) return <p className="text-red-500">{error}</p>;

  if (!post) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="container p-4 bg-background min-h-screen py-8">
      <div className=" mx-auto p-3 text-primaryText max-w-4xl shadow-lg rounded-lg bg-white">
        {post.imagePath && (
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}${
              post.imagePath.startsWith("/")
                ? post.imagePath
                : `/${post.imagePath}`
            }`}
            alt={`Image for post: ${post.title}`}
            className="w-full h-100 object-cover rounded-md mb-6 shadow-md"
          />
        )}
        <div className="mb-6">
          <h2 className="text-4xl font-extrabold mb-2">{post.title}</h2>
          <p className="text-gray-600 text-sm">
            Category: {post.category} | Author: {post.author.firstName}
          </p>
        </div>
        <div>{showFirstFewLines(post.content, 1000)}</div>
        {userId === post.author._id && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded shadow-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePost;
