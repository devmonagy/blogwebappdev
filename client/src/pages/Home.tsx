import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  createdAt: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // 🔁 Wake up Render backend
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
  }, []);

  const truncateContent = (content: string, maxLength: number) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const htmlContent = doc.body.textContent || "";
    const truncated = htmlContent.slice(0, maxLength);
    return truncated.length < htmlContent.length
      ? `${truncated}...`
      : truncated;
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

  return (
    <div className="bg-background min-h-screen">
      <div className="container py-10 mx-auto p-7 flex flex-col gap-6 lg:max-w-screen-md">
        {loading ? (
          renderSkeleton()
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : posts.length > 0 ? (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
                className="flex flex-row items-center p-4 rounded shadow-sm bg-white cursor-pointer hover:shadow-lg transition-shadow opacity-0 animate-fade-in"
              >
                <div className="flex-1">
                  <h2 className="text-sm sm:text-lg font-semibold">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    Category: {post.category} | Author: {post.author.firstName}
                  </p>
                  <div
                    className="text-xs sm:text-sm mb-4"
                    dangerouslySetInnerHTML={{
                      __html: truncateContent(post.content, 100),
                    }}
                  />
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
                {post.imagePath && (
                  <img
                    src={getValidImageUrl(post.imagePath)}
                    alt={post.title}
                    className="w-24 h-24 object-cover rounded ml-4 sm:w-32 sm:h-32"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts available yet.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
