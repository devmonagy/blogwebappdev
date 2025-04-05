import { Router, Request, Response } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  updatePost,
} from "../controllers/postController";
import authenticate from "../middleware/authenticate";
import { checkAdmin } from "../middleware/checkAdmin";
import Post from "../models/Post";
import { createUploadMiddleware } from "../middleware/upload"; // Import factory function

// Create Cloudinary upload middleware specifically for blog post images
const postImageUpload = createUploadMiddleware("BlogPostImages");

// Optional: define AuthenticatedRequest for better typing
interface AuthenticatedRequest extends Request {
  userId?: string;
}

const router = Router();

// Route to get all posts created by the logged-in user
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

// Route to create a new post (Cloudinary handles image)
router.post(
  "/create",
  authenticate,
  postImageUpload.single("image"),
  createPost
);

// Route to get all posts
router.get("/", getPosts);

// Route to get a single post by ID
router.get("/:id", getPostById);

// Route to update a post by ID (admin + upload)
router.put(
  "/:id",
  authenticate,
  checkAdmin,
  postImageUpload.single("image"),
  updatePost
);

// Route to delete a post by ID (admin)
router.delete("/:id", authenticate, checkAdmin, deletePost);

export default router;
