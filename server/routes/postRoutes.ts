import { Router, Request, Response } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  updatePost,
  getPostClaps,
  undoUserClaps,
  getClapUsers, // ✅ Import added
} from "../controllers/postController";
import authenticate from "../middleware/authenticate";
import { checkAdmin } from "../middleware/checkAdmin";
import Post from "../models/Post";
import { createUploadMiddleware } from "../middleware/upload";

// Create Cloudinary upload middleware specifically for blog post images
const postImageUpload = createUploadMiddleware("BlogPostImages");

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const router = Router();

// Get all posts created by the logged-in user
router.get(
  "/user-posts",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId;
    try {
      const userPosts = await Post.find({ author: userId });
      res.status(200).json(userPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ error: "Failed to fetch user posts" });
    }
  }
);

// Create a new post (Cloudinary handles image)
router.post(
  "/create",
  authenticate,
  postImageUpload.single("image"),
  createPost
);

// Get all posts
router.get("/", getPosts);

// Get a single post by ID
router.get("/:id", getPostById);

// Fetch clap data for a post (total + user's claps)
router.get("/:postId/claps", authenticate, getPostClaps);

// 🔄 Undo claps for a post by the current user
router.post("/:postId/undo-claps", authenticate, undoUserClaps);

// ✅ NEW: Get list of users who clapped on a post
router.get("/:postId/clap-users", authenticate, getClapUsers);

// Update a post by ID (admin + upload)
router.put(
  "/:id",
  authenticate,
  checkAdmin,
  postImageUpload.single("image"),
  updatePost
);

// Delete a post by ID (admin)
router.delete("/:id", authenticate, checkAdmin, deletePost);

export default router;
