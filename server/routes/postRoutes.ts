import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  updatePost,
} from "../controllers/postController";
import authenticate from "../middleware/authenticate";
import Post from "../models/Post"; // Import the Post model
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

const router = Router();

// Route to get all posts created by the logged-in user
router.get("/user-posts", authenticate, async (req, res) => {
  const userId = (req as any).userId; // Assuming userId is attached by the authenticate middleware
  try {
    const userPosts = await Post.find({ author: userId });
    res.status(200).json(userPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error); // Log full error stack
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

// Route to create a new post (with authentication and file upload)
router.post("/create", authenticate, upload.single("image"), createPost);

// Route to get all posts
router.get("/", getPosts);

// Route to get a single post by ID
router.get("/:id", getPostById);

// Route to update a post by ID (with authentication and file upload)
router.put("/:id", authenticate, upload.single("image"), updatePost);

// Route to delete a post by ID (with authentication)
router.delete("/:id", authenticate, deletePost);

export default router;
