import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role?: string;
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
  isAuthenticated: boolean;
  user?: Author;
}

const CommentInput: React.FC<Props> = ({
  postId,
  editingComment,
  onCommentSubmit,
  onCancelEdit,
  isAuthenticated,
  user,
}) => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultProfile =
    "https://res.cloudinary.com/dqdix32m5/image/upload/v1744561630/user_v0drnu_loggedoutdefault_z25o5l.png";

  const profilePicture = user?.profilePicture || defaultProfile;
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";

  const isAdmin = user?.role === "admin";
  const editingAnotherUser =
    editingComment && user && editingComment.author._id !== user._id;

  useEffect(() => {
    if (editingComment) {
      setContent(editingComment.content);
      setIsExpanded(true);
    } else {
      setContent("");
    }
  }, [editingComment]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🔒 Check for incomplete profile
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const isProfileIncomplete = !storedUser.firstName || !storedUser.lastName;

      if (isProfileIncomplete) {
        navigate("/complete-profile");
        return;
      }

      const endpoint = editingComment
        ? `${process.env.REACT_APP_BACKEND_URL}/comments/${editingComment._id}`
        : `${process.env.REACT_APP_BACKEND_URL}/comments`;

      const method = editingComment ? "PUT" : "POST";
      const body = editingComment ? { content } : { postId, content };

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error submitting comment:", errorText);
        return;
      }

      const data = await response.json();
      onCommentSubmit(data as CommentData);
      setContent("");
      setIsExpanded(false);
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="flex items-start gap-3 py-4 cursor-pointer border-t"
        onClick={() => navigate("/login")}
      >
        <img
          src={defaultProfile}
          alt="Default user"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex flex-col w-full">
          <span className="text-sm font-medium text-gray-500">
            Write a response
          </span>
          <div className="bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm mt-1">
            What are your thoughts?
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-4">
      <div className="flex items-start gap-3 mb-2">
        <img
          src={profilePicture}
          alt={fullName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="text-sm font-medium">
          {fullName}
          {editingComment && editingAnotherUser && (
            <span className="block text-xs text-gray-500">
              Editing {editingComment.author.firstName}'s response
            </span>
          )}
        </div>
      </div>
      {!isExpanded ? (
        <div
          className="bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm cursor-pointer"
          onClick={() => {
            if (!user?.firstName || !user?.lastName) {
              navigate("/complete-profile");
            } else {
              setIsExpanded(true);
            }
          }}
        >
          What are your thoughts?
        </div>
      ) : (
        <div className="bg-gray-100 rounded-md p-3">
          <textarea
            className="w-full bg-gray-100 resize-none text-base p-2 rounded-md outline-none"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What are your thoughts?"
          />
          <div className="flex justify-end gap-3 mt-2">
            <button
              className="text-sm text-gray-600 hover:underline"
              onClick={() => {
                setIsExpanded(false);
                setContent("");
                if (editingComment) onCancelEdit();
              }}
            >
              Cancel
            </button>
            <button
              className={`text-sm px-4 py-1 rounded ${
                content.trim()
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
              disabled={!content.trim()}
            >
              {editingComment ? "Update" : "Respond"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
