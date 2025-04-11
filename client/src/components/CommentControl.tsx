import React from "react";
import commentIcon from "../assets/commentsLight.png";

const CommentControl: React.FC = () => {
  return (
    <div className="flex items-center text-gray-600 cursor-pointer">
      <img
        src={commentIcon}
        alt="Comments"
        className="w-4 h-4 mr-1 object-contain"
      />
      <span>0</span>
    </div>
  );
};

export default CommentControl;
