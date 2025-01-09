import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import "../styles/quill-custom.css";

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post<{ user: { _id: string } }>(
          `${process.env.REACT_APP_BACKEND_URL}/auth/validate-token`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          setUserId(response.data.user._id);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    if (!post) return null; // Guard to ensure post is not null
    return (
      <div
        className="text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />
    );
  };

  const contentForUnauthenticated = () => {
    if (!post) return null; // Guard to ensure post is not null
    return (
      <>
        <div
          className="text-base leading-relaxed fade-out-overlay"
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

  return (
    <div className="container p-7 bg-background min-h-screen py-8 lg:max-w-screen-md">
      <div className="mx-auto p-3 text-primaryText shadow-lg rounded-lg bg-white">
        <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
        <div className="flex items-center mb-6">
          <img
            src={
              post?.author.profilePicture
                ? post.author.profilePicture.startsWith("http")
                  ? post.author.profilePicture
                  : `${process.env.REACT_APP_BACKEND_URL}${post.author.profilePicture}`
                : "/default-profile-picture.jpg"
            }
            alt={`${post?.author.firstName}'s profile`}
            className="w-12 h-12 rounded-full object-cover shadow-md mr-4"
          />

          <div>
            <p className="text-lg font-medium">{post?.author.firstName}</p>
            <p className="text-sm text-gray-500">
              Published in:{" "}
              <span className="font-semibold">{post?.category}</span> ·{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-b py-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600 cursor-pointer">
              <span className="material-icons mr-1">thumb_up</span>
              <span>0</span>
            </div>
            <div className="flex items-center text-gray-600 cursor-pointer">
              <span className="material-icons mr-1">chat_bubble_outline</span>
              <span>0</span>
            </div>
          </div>
          <div className="relative flex items-center space-x-4">
            <span className="material-icons text-gray-600 cursor-pointer">
              bookmark_border
            </span>
            <span className="material-icons text-gray-600 cursor-pointer">
              share
            </span>
            {userId && (
              <>
                <span
                  className="material-icons text-gray-600 cursor-pointer"
                  ref={iconRef}
                  onClick={() => setShowOptions(!showOptions)}
                >
                  more_vert
                </span>
                <div
                  ref={menuRef}
                  className={`absolute right-0 w-48 bg-white rounded-md shadow-xl z-20 ${
                    !showOptions ? "hidden" : ""
                  }`}
                  style={{
                    top: `${
                      iconRef.current ? iconRef.current.offsetHeight + 2 : 20
                    }px`,
                  }}
                >
                  <ul>
                    {userId === post.author._id && (
                      <>
                        <li
                          className="cursor-pointer hover:bg-gray-100 text-gray-900 px-4 py-2 text-sm"
                          onClick={handleEdit}
                        >
                          Edit
                        </li>
                        <li
                          className="cursor-pointer hover:bg-gray-100 text-gray-900 px-4 py-2 text-sm"
                          onClick={handleDelete}
                        >
                          Delete
                        </li>
                        <li className="mx-4 h-px bg-gray-300"></li>{" "}
                        {/* Divider */}
                      </>
                    )}
                    {userId !== post.author._id && (
                      <li className="cursor-pointer hover:bg-gray-100 text-gray-900 px-4 py-2 text-sm">
                        Follow Author
                      </li>
                    )}
                    <li className="cursor-pointer hover:bg-gray-100 text-gray-900 px-4 py-2 text-sm">
                      Show More
                    </li>
                    <li className="cursor-pointer hover:bg-gray-100 text-gray-900 px-4 py-2 text-sm">
                      Show Less
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
        {post?.imagePath && (
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}${post.imagePath}`}
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
