import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import clapSolidImage from "../assets/clapSolid.png";
import commentSolidImage from "../assets/commentsSolid.png"; // ✅ Updated icon
import "../styles/quill-custom.css";

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
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
  clapsCount?: number;
  commentsCount?: number;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [infoBarVisible, setInfoBarVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/`);
      const response = await axios.get<Post[]>(
        `${process.env.REACT_APP_BACKEND_URL}/posts`
      );
      const sortedPosts = response.data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch recent posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const timer = setTimeout(() => setInfoBarVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const truncateContent = (content: string, maxLength: number) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const htmlContent = doc.body.textContent || "";
    return htmlContent.length > maxLength
      ? `${htmlContent.slice(0, maxLength)}...`
      : htmlContent;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getValidImageUrl = (url: string) => {
    return url.startsWith("http")
      ? url
      : `${process.env.REACT_APP_BACKEND_URL}${
          url.startsWith("/") ? "" : "/"
        }${url}`;
  };

  const renderSkeleton = () => (
    <div className="animate-pulse flex flex-col gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-row items-center p-4 rounded bg-white shadow-sm"
        >
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-full" />
          </div>
          <div className="ml-4 bg-gray-300 w-24 h-24 sm:w-32 sm:h-32 rounded" />
        </div>
      ))}
    </div>
  );

  const handleCloseInfoBar = () => setInfoBarVisible(false);

  return (
    <div className="bg-background min-h-screen relative">
      <div className="container py-10 mx-auto p-7 flex flex-col gap-6 lg:max-w-screen-md">
        {loading ? (
          renderSkeleton()
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : posts.length > 0 ? (
          posts.map((post) => {
            const hasClaps = (post.clapsCount ?? 0) > 0;
            const hasComments = (post.commentsCount ?? 0) > 0;

            return (
              <div
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
                className="flex flex-row items-center p-4 rounded shadow-sm bg-white cursor-pointer hover:shadow-lg transition-shadow opacity-0 animate-fade-in"
              >
                <div className="flex-1">
                  {/* AUTHOR */}
                  <div className="flex items-center gap-2 mb-4">
                    <img
                      src={getValidImageUrl(
                        post.author.profilePicture ||
                          "/default-profile-picture.jpg"
                      )}
                      alt={post.author.firstName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium">
                      {post.author.firstName} {post.author.lastName}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h2 className="text-sm text-primaryText sm:text-lg font-semibold mb-2">
                    {post.title}
                  </h2>

                  {/* EXCERPT */}
                  <div
                    className="text-xs sm:text-sm mb-4 text-secondaryText"
                    dangerouslySetInnerHTML={{
                      __html: truncateContent(post.content, 100),
                    }}
                  />

                  {/* DATE + CLAPS + COMMENTS */}
                  <div className="flex items-center gap-4 text-xs text-secondaryText">
                    <span>{formatDate(post.createdAt)}</span>
                    <div className="flex items-center gap-4">
                      {hasClaps && (
                        <div className="flex items-center gap-1">
                          <img
                            src={clapSolidImage}
                            alt="Claps"
                            className="w-3.5 h-3.5 opacity-35"
                          />
                          <span>{post.clapsCount}</span>
                        </div>
                      )}
                      {hasComments && (
                        <div className="flex items-center gap-1">
                          <img
                            src={commentSolidImage}
                            alt="Comments"
                            className="w-3 h-3 opacity-35"
                          />
                          <span>{post.commentsCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* IMAGE */}
                {post.imagePath && (
                  <img
                    src={getValidImageUrl(post.imagePath)}
                    alt={post.title}
                    className="w-24 h-24 object-cover rounded ml-4 sm:w-32 sm:h-32"
                  />
                )}
              </div>
            );
          })
        ) : (
          <p className="text-secondaryText">No posts available yet.</p>
        )}

        {/* INFO BAR */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-primaryButton text-white py-3 px-4 text-center transition-transform duration-1000 ease-in-out flex justify-between items-center ${
            infoBarVisible ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <span className="info-text text-xs sm:text-sm md:text-base lg:text-lg">
            Production v1.2.0 — under active development 🚀. Feedback and bug
            reports are always welcome! 🙌.
          </span>
          <button
            onClick={handleCloseInfoBar}
            className="text-white text-2xl ml-4"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
