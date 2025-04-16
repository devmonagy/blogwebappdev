import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import PostActions from "../components/PostActions";
import PostHeader from "../components/PostHeader";
import CommentsDrawer from "../components/CommentsDrawer";
import CommentInput from "../components/CommentInput";
import CommentList from "../components/CommentList";
import socket from "../socket";

export interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface Post {
  _id: string;
  title: string;
  category: string;
  content: string;
  imagePath: string;
  author: Author;
  claps: number;
  createdAt: string;
}

export interface CommentData {
  _id: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  replies?: CommentData[];
  parentCommentId?: string;
}

const SinglePost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [editingComment, setEditingComment] = useState<CommentData | null>(
    null
  );
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<{ [key: string]: string }>(
    {}
  );

  const getTotalCommentCount = (list: CommentData[]): number => {
    let count = 0;
    for (const comment of list) {
      count += 1;
      if (comment.replies?.length) {
        count += getTotalCommentCount(comment.replies);
      }
    }
    return count;
  };

  const totalComments = getTotalCommentCount(comments);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post<{ user: Author & { role: string } }>(
          `${process.env.REACT_APP_BACKEND_URL}/auth/validate-token`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(({ data }) => {
          const user = data.user;
          setUserId(user._id);
          setUserRole(user.role);
          setIsAuthenticated(true);
        })
        .catch(() => {});
    }

    if (id) {
      axios
        .get<Post>(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`)
        .then((res) => setPost(res.data))
        .catch(() => {});
    }
  }, [id]);

  useEffect(() => {
    if (!post?._id) return;
    axios
      .get<CommentData[]>(
        `${process.env.REACT_APP_BACKEND_URL}/comments/${post._id}`
      )
      .then((res) => setComments(res.data))
      .catch(() => {});
  }, [post?._id]);

  useEffect(() => {
    const handleNewComment = (
      comment: CommentData & { parentComment?: string }
    ) => {
      const parentId = comment.parentCommentId || comment.parentComment;
      if (parentId) {
        const insertReply = (list: CommentData[]): CommentData[] =>
          list.map((c) => {
            if (c._id === parentId) {
              const alreadyExists = (c.replies || []).some(
                (r) => r._id === comment._id
              );
              if (alreadyExists) return c;
              return {
                ...c,
                replies: [...(c.replies || []), comment],
              };
            }
            return {
              ...c,
              replies: c.replies ? insertReply(c.replies) : [],
            };
          });
        setComments((prev) => insertReply(prev));
      } else {
        const exists = comments.some((c) => c._id === comment._id);
        if (!exists) {
          setComments((prev) => [...prev, { ...comment, replies: [] }]);
        }
      }
    };

    const bindSocket = () => {
      socket.on("commentAdded", handleNewComment);
    };

    if (socket.connected) {
      bindSocket();
    } else {
      socket.once("connect", bindSocket);
    }

    return () => {
      socket.off("commentAdded", handleNewComment);
    };
  }, [comments]);

  const handleCommentSubmit = (newComment: CommentData) => {
    if (editingComment) {
      const updateInTree = (list: CommentData[]): CommentData[] =>
        list.map((c) => {
          if (c._id === newComment._id) {
            return { ...c, content: newComment.content };
          }
          return {
            ...c,
            replies: c.replies ? updateInTree(c.replies) : [],
          };
        });
      setComments(updateInTree);
      setEditingComment(null);
    } else {
      setComments((prev) => [...prev, { ...newComment, replies: [] }]);
    }
  };

  const handleReplySubmit = (parentId: string) => {
    const content = replyTextMap[parentId];
    if (!content?.trim() || !userId || !post?._id) return;

    socket.emit("newComment", {
      postId: post._id,
      content: content.trim(),
      userId,
      parentComment: parentId,
    });

    setReplyTextMap((prev) => ({ ...prev, [parentId]: "" }));
    setActiveReply(null);
  };

  const handleCommentEdit = (comment: CommentData) => {
    setEditingComment(comment);
    setIsCommentsOpen(true);
  };

  const handleCommentDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/comments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const deleteFromTree = (list: CommentData[]): CommentData[] =>
      list
        .map((c) =>
          c._id === id
            ? null
            : { ...c, replies: deleteFromTree(c.replies || []) }
        )
        .filter(Boolean) as CommentData[];

    setComments(deleteFromTree);
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post deleted successfully.");
      navigate("/");
    } catch (err) {
      alert("Failed to delete the post.");
    }
  };

  const renderContent = () => {
    if (!post) return null;
    if (isAuthenticated) {
      return (
        <div
          className="ql-editor text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />
      );
    }
    return (
      <>
        <div
          className="ql-editor text-base leading-relaxed fade-out-overlay"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content.substring(0, 500)),
          }}
        />
        <div className="text-center my-4">
          <span className="text-gray-700">Continue reading this post by </span>
          <a
            href={`/login?redirect=/post/${id}`}
            className="text-blue-500 underline"
          >
            logging in
          </a>
          . Not a member?{" "}
          <a
            href={`/register?redirect=/post/${id}`}
            className="text-blue-500 underline"
          >
            Register now!
          </a>
        </div>
      </>
    );
  };

  if (!post) {
    return (
      <div className="container p-7 bg-background min-h-screen py-8 lg:max-w-screen-md">
        <div className="mx-auto p-4 shadow rounded-lg bg-white animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-300 rounded w-full" />
          <div className="h-4 bg-gray-300 rounded w-5/6" />
          <div className="h-4 bg-gray-300 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="container p-7 bg-background min-h-screen py-8 lg:max-w-screen-md">
      <div className="mx-auto p-3 text-primaryText shadow-lg rounded-lg bg-white animate-fade-in">
        <PostHeader post={post} />
        <PostActions
          userId={userId}
          userRole={userRole}
          postAuthorId={post.author._id}
          postId={post._id}
          handleEdit={() => navigate(`/edit-post/${id}`)}
          handlePinStory={() => {}}
          handleStorySettings={() => {}}
          handleDelete={handleDeletePost}
          onCommentsClick={() => setIsCommentsOpen(true)}
          commentCount={totalComments}
        />
        {renderContent()}
      </div>

      <CommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
      >
        <div className="flex flex-col gap-4 overflow-y-auto h-full">
          <h2 className="text-lg font-semibold mb-2">
            Responses {totalComments > 0 && <span>({totalComments})</span>}
          </h2>
          <CommentInput
            postId={post._id}
            onCommentSubmit={handleCommentSubmit}
            editingComment={editingComment}
            onCancelEdit={() => setEditingComment(null)}
          />
          <CommentList
            comments={comments}
            onEdit={handleCommentEdit}
            onDelete={handleCommentDelete}
            userId={userId}
            userRole={userRole}
            isAuthenticated={isAuthenticated}
            activeReply={activeReply}
            setActiveReply={setActiveReply}
            replyTextMap={replyTextMap}
            setReplyTextMap={setReplyTextMap}
            onReplySubmit={handleReplySubmit}
          />
        </div>
      </CommentsDrawer>
    </div>
  );
};

export default SinglePost;
