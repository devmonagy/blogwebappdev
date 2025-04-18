import express from "express";
import {
  createComment,
  getCommentsByPostId,
  deleteComment,
  updateComment, // ✅ NEW
} from "../controllers/commentController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

// GET all comments for a post (public)
router.get("/:postId", getCommentsByPostId);

// POST a new comment (authenticated)
router.post("/", authenticate, createComment);

// ✅ PUT update a comment (authenticated)
router.put("/:id", authenticate, updateComment);

// DELETE a comment and its replies (authenticated)
router.delete("/:id", authenticate, deleteComment);

export default router;
