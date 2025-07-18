import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import PostActions from "../components/PostActions";
import PostHeader from "../components/PostHeader";
import CommentsDrawer from "../components/CommentsDrawer";
import CommentInput from "../components/CommentInput";
import CommentList from "../components/CommentList";
import CommentThread from "../components/CommentThread";
import socket from "../socket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [user, setUser] = useState<Author | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [editingComment, setEditingComment] = useState<CommentData | null>(
    null
  );
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<{ [key: string]: string }>(
    {}
  );
  const [timeDrift, setTimeDrift] = useState<number>(0);

  const getTotalCommentCount = (list: CommentData[]): number =>
    list.reduce(
      (acc, comment) => acc + 1 + getTotalCommentCount(comment.replies || []),
      0
    );

  const totalComments = getTotalCommentCount(comments);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/auth/validate-token`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res: any) => {
          const user = res.data.user;
          setUserId(user._id);
          setUserRole(user.role);
          setIsAuthenticated(true);
          setUser({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
          });
        })
        .catch(() => {});
    }

    if (id) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`)
        .then((res: any) => setPost(res.data))
        .catch(() => {});
    }

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/server-time`)
      .then((res: any) => {
        const serverTime = new Date(res.data.serverTime).getTime();
        const localTime = Date.now();
        setTimeDrift(serverTime - localTime);
      })
      .catch(() => {
        setTimeDrift(0);
      });
  }, [id]);

  useEffect(() => {
    if (!post?._id) return;
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/comments/${post._id}`)
      .then((res: any) => {
        const adjusted = applyTimeDrift(res.data, timeDrift);
        setComments(adjusted);
      })
      .catch(() => {});
  }, [post?._id, timeDrift]);

  const applyTimeDrift = (list: CommentData[], drift: number): CommentData[] =>
    list.map((comment) => ({
      ...comment,
      createdAt: new Date(
        new Date(comment.createdAt).getTime() + drift
      ).toISOString(),
      replies: comment.replies ? applyTimeDrift(comment.replies, drift) : [],
    }));

  useEffect(() => {
    const handleNewComment = (
      comment: CommentData & { parentComment?: string }
    ) => {
      const parentId = comment.parentCommentId || comment.parentComment;

      const adjustedComment: CommentData = {
        ...comment,
        createdAt: new Date(
          new Date(comment.createdAt).getTime() + timeDrift
        ).toISOString(),
      };

      setComments((prev) => {
        const insertReply = (list: CommentData[]): CommentData[] =>
          list.map((c) => {
            if (c._id === parentId) {
              const replies = (c.replies || []).filter((r) => {
                const isOptimistic =
                  r._id.startsWith("temp-") &&
                  r.content.trim() === adjustedComment.content.trim() &&
                  r.author._id === adjustedComment.author._id;
                return !isOptimistic;
              });

              return {
                ...c,
                replies: [...replies, adjustedComment],
              };
            }

            return {
              ...c,
              replies: c.replies ? insertReply(c.replies) : [],
            };
          });

        if (parentId) return insertReply([...prev]);

        const exists = prev.some((c) => c._id === adjustedComment._id);
        if (!exists) return [...prev, { ...adjustedComment, replies: [] }];

        return prev;
      });
    };

    socket.on("commentAdded", handleNewComment);
    return () => {
      socket.off("commentAdded", handleNewComment);
    };
  }, [timeDrift]);

  const handleCommentSubmit = (newComment: CommentData) => {
    if (editingComment) {
      const updateInTree = (list: CommentData[]): CommentData[] =>
        list.map((c) =>
          c._id === newComment._id
            ? { ...c, content: newComment.content }
            : { ...c, replies: c.replies ? updateInTree(c.replies) : [] }
        );
      setComments(updateInTree);
      setEditingComment(null);
    } else {
      setComments((prev) => [...prev, { ...newComment, replies: [] }]);
    }
  };

  const handleReplySubmit = (parentId: string) => {
    const content = replyTextMap[parentId];
    if (!content?.trim() || !userId || !post?._id) return;

    const optimisticReply: CommentData = {
      _id: `temp-${Date.now()}`,
      postId: post._id,
      content: content.trim(),
      createdAt: new Date(Date.now() + timeDrift).toISOString(),
      updatedAt: new Date(Date.now() + timeDrift).toISOString(),
      author: {
        _id: userId,
        firstName: localStorage.getItem("firstName") || "You",
        lastName: localStorage.getItem("lastName") || "",
        profilePicture: localStorage.getItem("profilePicture") || "",
      },
      parentCommentId: parentId,
      replies: [],
    };

    const insertOptimistic = (list: CommentData[]): CommentData[] =>
      list.map((c) =>
        c._id === parentId
          ? { ...c, replies: [...(c.replies || []), optimisticReply] }
          : { ...c, replies: c.replies ? insertOptimistic(c.replies) : [] }
      );

    setComments((prev) => insertOptimistic([...prev]));

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

      navigate("/", {
        state: { toastMessage: "Post deleted successfully." },
      });
    } catch (err) {
      toast.error("Failed to delete the post.");
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
      <ToastContainer />
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

      <div className="mx-auto mt-10 p-4 bg-white shadow-sm rounded-lg text-primaryText">
        <h2 className="text-lg font-semibold mb-4">
          Responses {totalComments > 0 && <span>({totalComments})</span>}
        </h2>

        <CommentInput
          postId={post._id}
          onCommentSubmit={handleCommentSubmit}
          editingComment={editingComment}
          onCancelEdit={() => setEditingComment(null)}
          isAuthenticated={isAuthenticated}
          user={user || undefined}
        />

        <div className="mt-6 space-y-6">
          {comments.slice(0, 3).map((comment) => (
            <CommentThread
              key={comment._id}
              comment={comment}
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
              timeDrift={timeDrift}
            />
          ))}
        </div>

        {totalComments > 3 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setIsCommentsOpen(true)}
              className="border border-gray-300 px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition"
            >
              See all responses
            </button>
          </div>
        )}
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
            isAuthenticated={isAuthenticated}
            user={user || undefined}
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
            timeDrift={timeDrift}
          />
        </div>
      </CommentsDrawer>
    </div>
  );
};

export default SinglePost;
