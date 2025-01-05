import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Author {
  _id: string;
  firstName: string;
}

interface Post {
  _id: string;
  title: string;
  category: string;
  content: string; // This will contain HTML content
  imagePath: string;
  author: Author;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get<Post[]>(
        `${process.env.REACT_APP_BACKEND_URL}/posts`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch recent posts.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to truncate HTML content while preserving styles and removing line breaks
  const truncateContent = (content: string, maxLength: number) => {
    // Create a DOM parser to parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    // Remove all <br> tags and replace with spaces
    const brTags = doc.querySelectorAll("br");
    brTags.forEach((br) => br.parentNode?.removeChild(br));

    // Get the updated HTML content
    const htmlContent = doc.body.innerHTML;

    // Truncate the HTML content while keeping the inline styles intact
    const truncated = htmlContent.slice(0, maxLength);

    // Add "..." if the content is truncated
    return truncated.length < htmlContent.length
      ? `${truncated}...`
      : truncated;
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto p-4 text-primaryText">
        <h2 className="text-3xl font-bold mb-4 py-1 text-center">
          Recent Posts
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="border p-4 rounded shadow-md">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Category: {post.category} | Author: {post.author.firstName}
                </p>
                {post.imagePath && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}${
                      post.imagePath.startsWith("/")
                        ? post.imagePath
                        : `/${post.imagePath}`
                    }`}
                    alt={post.title}
                    className="w-full h-48 object-cover mb-2 rounded"
                  />
                )}
                <div
                  className="text-xs"
                  dangerouslySetInnerHTML={{
                    __html: truncateContent(post.content, 300),
                  }}
                />
                <Link
                  to={`/post/${post._id}`}
                  className="text-href hover:underline mt-2 block"
                >
                  Read More
                </Link>
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
