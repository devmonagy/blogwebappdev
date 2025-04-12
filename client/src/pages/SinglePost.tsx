import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import "../styles/quill-custom.css";
import PostActions from "../components/PostActions";

interface Author {
  _id: string;
  firstName: string;
  lastName: string; // ✅ Added
  profilePicture?: string;
}

interface Post {
  _id: string;
  title: string;
  category: string;
  content: string;
  imagePath: string;
  author: Author;
  claps: number;
  createdAt: string;
}

const SinglePost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
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
      setLoading(true);
      try {
        const response = await axios.get<Post>(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${id}`
        );
        setPost(response.data);
      } catch {
        setError("Failed to fetch the post.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const handleEdit = () => navigate(`/edit-post/${id}`);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post deleted successfully.");
      navigate("/");
    } catch {
      setError("Failed to delete the post.");
    }
  };

  const getValidImageUrl = (url: string) => {
    return url.startsWith("http")
      ? url
      : `${process.env.REACT_APP_BACKEND_URL}${url}`;
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

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-300 rounded w-3/4" />
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gray-300" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="w-full h-64 bg-gray-200 rounded-md" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-4 bg-gray-100 rounded w-4/6" />
      </div>
    </div>
  );

  return (
    <div className="container p-7 bg-background min-h-screen py-8 lg:max-w-screen-md">
      <div className="mx-auto p-3 text-primaryText shadow-lg rounded-lg bg-white animate-fade-in">
        {loading ? (
          renderSkeleton()
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : post ? (
          <>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center mb-6">
              <img
                src={
                  post.author.profilePicture
                    ? getValidImageUrl(post.author.profilePicture)
                    : "/default-profile-picture.jpg"
                }
                alt={`${post.author.firstName} ${post.author.lastName}'s profile`}
                className="w-12 h-12 rounded-full object-cover shadow-md mr-4"
              />
              <div>
                <p className="text-lg font-medium">
                  {post.author.firstName} {post.author.lastName}
                </p>
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
              postId={post._id}
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
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SinglePost;
