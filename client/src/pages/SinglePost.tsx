// client/src/pages/SinglePost.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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

const SinglePost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!post) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-4 text-primaryText">
      <h2 className="text-3xl font-bold mb-2">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-4">
        Category: {post.category} | Author: {post.author.firstName}
      </p>
      {post.imagePath && (
        <img
          src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.imagePath}`}
          alt={post.title}
          className="w-full h-64 object-cover mb-4 rounded"
        />
      )}
      <p className="text-base">{post.content}</p>
    </div>
  );
};

export default SinglePost;
