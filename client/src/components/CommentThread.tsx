import React, { useRef, useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { format } from "timeago.js";
import ReplyInput from "./ReplyInput";
import commentIcon from "../assets/commentsLight.png";

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
  timeDrift?: number;
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
  timeDrift = 0,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const [wasActive, setWasActive] = useState(false);
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

  const displayTime = () => {
    const createdTime = new Date(comment.createdAt).getTime() + timeDrift;
    const currentTime = Date.now() + timeDrift;

    if (Math.abs(currentTime - createdTime) < 10000) return "Just now";
    return format(createdTime);
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Only auto-expand replies if *this comment* was just replied to
  useEffect(() => {
    if (activeReply === comment._id) {
      setWasActive(true);
    } else if (wasActive && activeReply === null) {
      setRepliesOpen(true);
      setWasActive(false);
    }
  }, [activeReply, comment._id, wasActive]);

  return (
    <div className="mb-4 ml-0 sm:ml-6 relative">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <img
            src={profilePicture}
            alt={fullName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium text-sm">{fullName}</span>
            <span className="text-xs text-gray-400">{displayTime()}</span>
          </div>
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

      <div className="flex items-center gap-3 mb-2 text-xs text-gray-500">
        {comment.replies && comment.replies.length > 0 && (
          <button
            onClick={() => setRepliesOpen((prev) => !prev)}
            className="flex items-center gap-1 hover:text-black"
          >
            <img src={commentIcon} alt="Replies" className="w-4 h-4" />
            <span>
              {repliesOpen
                ? "Hide replies"
                : `${comment.replies.length} ${
                    comment.replies.length === 1 ? "Reply" : "Replies"
                  }`}
            </span>
          </button>
        )}

        <button
          onClick={() => {
            if (isAuthenticated) {
              setActiveReply(comment._id);
            } else {
              window.location.href = "/login";
            }
          }}
          className="hover:text-black"
        >
          Reply
        </button>
      </div>

      {activeReply === comment._id && (
        <div className="ml-4 mb-3">
          {isAuthenticated ? (
            <ReplyInput
              isAuthenticated={isAuthenticated}
              replyingToName={fullName}
              replyText={replyTextMap[comment._id] || ""}
              setReplyText={(text: string) =>
                setReplyTextMap((prev) => ({ ...prev, [comment._id]: text }))
              }
              onCancel={() => setActiveReply(null)}
              onSubmit={() => onReplySubmit(comment._id)}
            />
          ) : (
            <div
              onClick={() => (window.location.href = "/login")}
              className="bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm cursor-pointer"
            >
              What are your thoughts?
            </div>
          )}
        </div>
      )}

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          repliesOpen
            ? "max-h-[1000px] opacity-100 scale-100"
            : "max-h-0 opacity-0 scale-95"
        }`}
      >
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
                timeDrift={timeDrift}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentThread;
