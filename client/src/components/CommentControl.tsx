import React from "react";
import commentIcon from "../assets/commentsLight.png";

interface CommentControlProps {
  onClick: () => void;
  commentCount: number; // ✅ new prop
}

const CommentControl: React.FC<CommentControlProps> = ({
  onClick,
  commentCount,
}) => {
  return (
    <div
      className="flex items-center cursor-pointer text-sm text-black"
      onClick={onClick}
    >
      <img
        src={commentIcon}
        alt="Comments"
        className="w-4 h-4 mr-1 object-contain"
      />
      <span className="ml-0.5 sm:ml-0">{commentCount}</span> {/* ✅ dynamic */}
    </div>
  );
};

export default CommentControl;
