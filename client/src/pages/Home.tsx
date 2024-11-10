// client/src/pages/Home.tsx
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
  content: string;
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

  return (
    <div className="p-4 text-primaryText">
      <h2 className="text-3xl font-bold mb-4 py-1">Recent Posts</h2>
      {error && <p className="text-red-500">{error}</p>}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="border p-4 rounded shadow-md">
              <h3 className="text-1xl font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                Category: {post.category} | Author: {post.author.firstName}
              </p>
              {post.imagePath && (
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.imagePath}`}
                  alt={post.title}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
              )}
              <p className="text-base">
                {post.content.slice(0, 300)} [...] {/* Display excerpt */}
              </p>
              <Link
                to={`/post/${post._id}`}
                className="text-blue-500 hover:underline mt-2 block"
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
  );
};

export default Home;
