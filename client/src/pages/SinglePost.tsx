import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import "../styles/quill-custom.css";
import PostActions from "../components/PostActions";

interface Author {
  _id: string;
  firstName: string;
  profilePicture?: string;
}

interface Post {
  _id: string;
  title: string;
  category: string;
  content: string;
  imagePath: string;
  author: Author;
  createdAt: string;
}

const SinglePost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post<{ user: { _id: string; role: string } }>(
          `${process.env.REACT_APP_BACKEND_URL}/auth/validate-token`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          setUserId(response.data.user._id);
          setUserRole(response.data.user.role);
          setIsAuthenticated(true);
        })
        .catch(() => {
          setError("Authentication failed");
        });
    }

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
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Post deleted successfully.");
        navigate("/");
      } catch {
        setError("Failed to delete the post.");
      }
    }
  };

  const contentForAuthenticated = () => {
    if (!post) return null;
    return (
      <div
        className="ql-editor text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />
    );
  };

  const contentForUnauthenticated = () => {
    if (!post) return null;
    return (
      <>
        <div
          className="ql-editor text-base leading-relaxed fade-out-overlay"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content.substring(0, 500)),
          }}
        />
        <div className="text-center my-4">
          <span className="text-gray-700">Continue reading this post by </span>
          <a href="/login" className="text-blue-500 underline">
            logging in
          </a>
          . Not a member?{" "}
          <a href="/register" className="text-blue-500 underline">
            Register now!
          </a>
        </div>
      </>
    );
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p className="text-gray-500">Loading...</p>;

  const getValidImageUrl = (url: string) => {
    return url.startsWith("http")
      ? url
      : `${process.env.REACT_APP_BACKEND_URL}${url}`;
  };

  return (
    <div className="container p-7 bg-background min-h-screen py-8 lg:max-w-screen-md">
      <div className="mx-auto p-3 text-primaryText shadow-lg rounded-lg bg-white">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center mb-6">
          <img
            src={
              post.author.profilePicture
                ? getValidImageUrl(post.author.profilePicture)
                : "/default-profile-picture.jpg"
            }
            alt={`${post.author.firstName}'s profile`}
            className="w-12 h-12 rounded-full object-cover shadow-md mr-4"
          />
          <div>
            <p className="text-lg font-medium">{post.author.firstName}</p>
            <p className="text-sm text-gray-500">
              Published in:{" "}
              <span className="font-semibold">{post.category}</span> ·{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <PostActions
          userId={userId}
          userRole={userRole}
          postAuthorId={post.author._id}
          handleEdit={handleEdit}
          handlePinStory={() => {}}
          handleStorySettings={() => {}}
          handleDelete={handleDelete}
        />
        {post.imagePath && (
          <img
            src={getValidImageUrl(post.imagePath)}
            alt={`Image for post: ${post.title}`}
            className="w-full h-80 object-cover rounded-md mb-6 shadow-md"
          />
        )}
        {isAuthenticated
          ? contentForAuthenticated()
          : contentForUnauthenticated()}
      </div>
    </div>
  );
};

export default SinglePost;
