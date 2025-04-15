import React, { useRef, useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

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
  comment: CommentData;
  onEdit: (comment: CommentData) => void;
  onDelete: (id: string) => void;
  userId: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  activeReply: string | null;
  setActiveReply: (id: string | null) => void;
  replyTextMap: { [key: string]: string };
  setReplyTextMap: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  onReplySubmit: (parentId: string) => void;
}

const CommentThread: React.FC<Props> = ({
  comment,
  onEdit,
  onDelete,
  userId,
  isAuthenticated,
  userRole,
  activeReply,
  setActiveReply,
  replyTextMap,
  setReplyTextMap,
  onReplySubmit,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const getValidImageUrl = (url?: string) => {
    if (!url) return "/default-profile-picture.jpg";
    return url.startsWith("http")
      ? url
      : `${process.env.REACT_APP_BACKEND_URL}${url}`;
  };

  const safeFirstName = comment.author?.firstName ?? "You";
  const safeLastName = comment.author?.lastName ?? "";
  const fullName = `${safeFirstName} ${safeLastName}`.trim();
  const profilePicture = getValidImageUrl(comment.author?.profilePicture);
  const canEditDelete = userId === comment.author._id || userRole === "admin";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="mb-4 ml-0 sm:ml-6 relative">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <img
            src={profilePicture}
            alt={fullName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="font-medium text-sm">{fullName}</span>
        </div>
        {canEditDelete && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-500 hover:text-black p-1"
            >
              <BsThreeDotsVertical />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 bg-white border rounded shadow-md text-sm z-10">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(comment);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(comment._id);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-700 mb-1 whitespace-pre-wrap">
        {comment.content}
      </p>

      {isAuthenticated && (
        <div className="mb-1">
          <button
            onClick={() => setActiveReply(comment._id)}
            className="text-xs text-gray-500 hover:text-black"
          >
            Reply
          </button>
        </div>
      )}

      {activeReply === comment._id && (
        <div className="ml-4 mb-2">
          <textarea
            placeholder="Write a reply..."
            value={replyTextMap[comment._id] || ""}
            onChange={(e) =>
              setReplyTextMap((prev) => ({
                ...prev,
                [comment._id]: e.target.value,
              }))
            }
            className="w-full border text-sm rounded p-2 mb-2"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={() => onReplySubmit(comment._id)}
              className="text-xs text-white bg-black rounded px-3 py-1 hover:bg-gray-800"
            >
              Post Reply
            </button>
            <button
              onClick={() => setActiveReply(null)}
              className="text-xs text-gray-600 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
        <div className="mt-2 ml-4 border-l pl-4">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply._id}
              comment={reply}
              onEdit={onEdit}
              onDelete={onDelete}
              userId={userId}
              userRole={userRole}
              isAuthenticated={isAuthenticated}
              activeReply={activeReply}
              setActiveReply={setActiveReply}
              replyTextMap={replyTextMap}
              setReplyTextMap={setReplyTextMap}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
