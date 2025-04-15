import React from "react";
import CommentThread from "./CommentThread";

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
  comments: CommentData[];
  onEdit: (comment: CommentData) => void;
  onDelete: (id: string) => void;
  userId: string | null;
  userRole: string | null; // ✅ Add userRole here
  isAuthenticated: boolean;
  activeReply: string | null;
  setActiveReply: (id: string | null) => void;
  replyTextMap: { [key: string]: string };
  setReplyTextMap: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  onReplySubmit: (parentId: string) => void;
}

const CommentList: React.FC<Props> = ({
  comments,
  onEdit,
  onDelete,
  userId,
  userRole, // ✅ Destructure userRole
  isAuthenticated,
  activeReply,
  setActiveReply,
  replyTextMap,
  setReplyTextMap,
  onReplySubmit,
}) => {
  return (
    <div>
      {comments.map((comment) => (
        <CommentThread
          key={comment._id}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
          userId={userId}
          userRole={userRole} // ✅ Pass userRole to CommentThread
          isAuthenticated={isAuthenticated}
          activeReply={activeReply}
          setActiveReply={setActiveReply}
          replyTextMap={replyTextMap}
          setReplyTextMap={setReplyTextMap}
          onReplySubmit={onReplySubmit}
        />
      ))}
    </div>
  );
};

export default CommentList;
