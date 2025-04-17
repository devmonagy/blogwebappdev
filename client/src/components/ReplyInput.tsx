import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  isAuthenticated: boolean;
  replyingToName: string;
  replyText: string;
  setReplyText: (text: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const ReplyInput: React.FC<Props> = ({
  isAuthenticated,
  replyingToName,
  replyText,
  setReplyText,
  onCancel,
  onSubmit,
}) => {
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div
        className="bg-gray-100 text-gray-400 text-sm p-3 rounded-md cursor-pointer"
        onClick={() => navigate("/login")}
      >
        What are your thoughts?
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-md p-3">
      <p className="text-xs text-gray-600 mb-1">Replying to {replyingToName}</p>
      <textarea
        className="w-full bg-gray-100 resize-none text-sm p-2 rounded-md outline-none"
        rows={3}
        placeholder="What are your thoughts?"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <div className="flex justify-end gap-3 mt-2">
        <button
          className="text-sm text-gray-600 hover:underline"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className={`text-sm px-4 py-1 rounded ${
            replyText.trim()
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={onSubmit}
          disabled={!replyText.trim()}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default ReplyInput;
