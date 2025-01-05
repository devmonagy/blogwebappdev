import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify"; // Import DOMPurify to sanitize HTML
import "../styles/quill-custom.css"; // Import your custom Quill CSS

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
      navigate(`/edit-post/${post._id}`);
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

  const showFirstFewLines = (content: string, limit: number) => {
    const text = DOMPurify.sanitize(content);
    const visibleContent = text.substring(0, limit);
    const remainingContent = text.substring(limit);

    return (
      <div>
        <div
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: visibleContent }}
        />
        {remainingContent && !isAuthenticated && (
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 bottom-0 backdrop-blur z-10 pointer-events-none rounded-xl" />
            <div className="z-20 text-center text-primaryText relative py-10 font-black">
              <p>
                Please{" "}
                <a href="/login" className="text-blue-500 underline">
                  Login
                </a>{" "}
                to view the full content. Not a member?{" "}
                <a href="/register" className="text-blue-500 underline">
                  Register
                </a>{" "}
                now!
              </p>
            </div>
            <div
              className="post-content mb-8 pointer-events-none"
              style={{ userSelect: "none" }}
              dangerouslySetInnerHTML={{ __html: remainingContent }}
            />
          </div>
        )}
        {isAuthenticated && (
          <div
            className="post-content mb-8"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(remainingContent),
            }}
          />
        )}
      </div>
    );
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!post) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto p-4 text-primaryText">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="w-full">
            {post.imagePath && (
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}${
                  post.imagePath.startsWith("/")
                    ? post.imagePath
                    : `/${post.imagePath}`
                }`}
                alt={`Image for post: ${post.title}`}
                className="w-full h-full object-cover rounded"
              />
            )}
          </div>
          <div className="flex flex-col justify-center items-start space-y-4">
            <h2 className="text-3xl font-bold">{post.title}</h2>
            <p className="text-sm text-gray-500">
              Category: {post.category} | Author: {post.author.firstName}
            </p>
          </div>
        </div>
        {showFirstFewLines(post.content, 500)}
        {userId === post.author._id && (
          <div className="flex gap-4">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit Post
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePost;
