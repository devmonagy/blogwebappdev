import { Request, Response } from "express";
import { Types } from "mongoose";
import Comment from "../models/Comment";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authenticate";

// Create a new comment
export const createComment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { postId, content, parentComment } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const newComment = await Comment.create({
      post: postId,
      author: userId,
      content,
      parentComment: parentComment || null,
    });

    await newComment.populate("author", "firstName lastName profilePicture");

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Failed to create comment", error: err });
  }
};

// Get comments for a post (nested)
export const getCommentsByPostId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "firstName lastName profilePicture")
      .sort({ createdAt: 1 });

    // Group replies under their parent
    const commentMap: { [key: string]: any } = {};
    const rootComments: any[] = [];

    comments.forEach((comment) => {
      const raw = comment.toObject() as {
        _id: string;
        parentComment?: any;
        [key: string]: any;
      };

      const commentObj = {
        ...raw,
        replies: [] as any[],
      };

      const id = raw._id;
      commentMap[id] = commentObj;

      if (raw.parentComment) {
        const parentId = raw.parentComment.toString();
        if (commentMap[parentId]) {
          commentMap[parentId].replies.push(commentObj);
        }
      } else {
        rootComments.push(commentObj);
      }
    });

    res.status(200).json(rootComments);
  } catch (err) {
    res.status(500).json({ message: "Failed to get comments", error: err });
  }
};

// Delete a comment and its replies
export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    // Delete all nested replies recursively
    const deleteReplies = async (parentId: string) => {
      const replies = await Comment.find({ parentComment: parentId });
      for (const reply of replies) {
        await deleteReplies((reply._id as Types.ObjectId).toString());
        await reply.deleteOne();
      }
    };

    await deleteReplies((comment._id as Types.ObjectId).toString());
    await comment.deleteOne();

    res.status(200).json({ message: "Comment and its replies deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Failed to delete comment", error: err });
  }
};
