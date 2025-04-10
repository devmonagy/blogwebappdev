import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";

const CommentControl: React.FC = () => {
  return (
    <div className="flex items-center text-gray-600 cursor-pointer">
      <FontAwesomeIcon icon={faComment} className="mr-1" />
      <span>0</span>
    </div>
  );
};

export default CommentControl;
