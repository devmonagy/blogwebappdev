import express from "express";
import {
  createComment,
  getCommentsByPostId,
  deleteComment,
} from "../controllers/commentController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

// GET all comments for a post (public)
// Endpoint: GET /comments/:postId
router.get("/:postId", getCommentsByPostId);

// POST a new comment (authenticated)
// Endpoint: POST /comments
router.post("/", authenticate, createComment);

// DELETE a comment and its replies (authenticated)
// Endpoint: DELETE /comments/:id
router.delete("/:id", authenticate, deleteComment);

export default router;
