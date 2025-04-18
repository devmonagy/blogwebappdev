import { Router, Request, Response } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  updatePost,
  getPostClaps,
  undoUserClaps,
  getClapUsers,
} from "../controllers/postController";
import authenticate from "../middleware/authenticate";
import Post from "../models/Post";
import { createUploadMiddleware } from "../middleware/upload";

// Cloudinary upload middleware for blog post images
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

// Create a new post
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

// PUBLIC: Get total/user claps
router.get("/:postId/claps", getPostClaps);

// Undo all claps by current user
router.post("/:postId/undo-claps", authenticate, undoUserClaps);

// PUBLIC: Get list of users who clapped on a post
router.get("/:postId/clap-users", getClapUsers);

// ✅ Allow both authors and admins to update/delete posts (check is inside controller)
router.put("/:id", authenticate, postImageUpload.single("image"), updatePost);

router.delete("/:id", authenticate, deletePost);

export default router;
