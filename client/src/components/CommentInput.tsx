import React, { useState, useEffect } from "react";
import axios from "axios";

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

interface CommentData {
  _id: string;
  postId: string;
  author: Author;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentCommentId?: string;
  replies?: CommentData[];
}

interface Props {
  postId: string;
  editingComment: CommentData | null;
  onCommentSubmit: (newComment: CommentData) => void;
  onCancelEdit: () => void;
}

const CommentInput: React.FC<Props> = ({
  postId,
  editingComment,
  onCommentSubmit,
  onCancelEdit,
}) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingComment) {
      setContent(editingComment.content);
    } else {
      setContent("");
    }
  }, [editingComment]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = editingComment
        ? `${process.env.REACT_APP_BACKEND_URL}/comments/${editingComment._id}`
        : `${process.env.REACT_APP_BACKEND_URL}/comments`;
      const method = editingComment ? "put" : "post";

      const response = await axios[method](
        endpoint,
        {
          postId,
          content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onCommentSubmit(response.data as CommentData);
      setContent("");
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  return (
    <div className="mb-4">
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a response..."
      />
      <div className="flex justify-end gap-2 mt-2">
        {editingComment && (
          <button
            className="text-sm text-gray-500 hover:underline"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
        <button
          className="bg-black text-white px-4 py-1 rounded"
          onClick={handleSubmit}
        >
          {editingComment ? "Update" : "Respond"}
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
