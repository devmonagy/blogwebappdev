import React from "react";

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
  activeReply,
  setActiveReply,
  replyTextMap,
  setReplyTextMap,
  onReplySubmit,
}) => {
  const getValidImageUrl = (url?: string) => {
    if (!url) return "/default-profile-picture.jpg";
    return url.startsWith("http")
      ? url
      : `${process.env.REACT_APP_BACKEND_URL}${url}`;
  };

  // Robust author fallback logic
  const safeFirstName = comment.author?.firstName ?? "You";
  const safeLastName = comment.author?.lastName ?? "";
  const fullName = `${safeFirstName} ${safeLastName}`.trim();

  const profilePicture = getValidImageUrl(comment.author?.profilePicture);

  return (
    <div className="mb-4 ml-0 sm:ml-6">
      <div className="flex items-center space-x-2 mb-1">
        <img
          src={profilePicture}
          alt={fullName}
          className="w-6 h-6 rounded-full object-cover"
        />
        <span className="font-medium text-sm">{fullName}</span>
      </div>

      <p className="text-sm text-gray-700 mb-1 whitespace-pre-wrap">
        {comment.content}
      </p>

      <div className="flex gap-3 text-xs text-gray-500 mb-1">
        <button onClick={() => onEdit(comment)}>Edit</button>
        <button onClick={() => onDelete(comment._id)}>Delete</button>
        {isAuthenticated && (
          <button onClick={() => setActiveReply(comment._id)}>Reply</button>
        )}
      </div>

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
