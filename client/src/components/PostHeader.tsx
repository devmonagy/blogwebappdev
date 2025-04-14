import React from "react";

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
}

const PostHeader: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{post.category}</p>
      <div className="flex items-center space-x-2 mb-4">
        <img
          src={post.author.profilePicture || "/default-avatar.png"}
          alt="Author"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-sm font-medium">
          {post.author.firstName} {post.author.lastName}
        </span>
      </div>
      {post.imagePath && (
        <img
          src={post.imagePath}
          alt="Post cover"
          className="w-full rounded-lg max-h-[400px] object-cover"
        />
      )}
    </div>
  );
};

export default PostHeader;
