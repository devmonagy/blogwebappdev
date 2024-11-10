import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  deletePost, // Import the deletePost function
  updatePost, // Import the updatePost function
} from "../controllers/postController";
import authenticate from "../middleware/authenticate";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

const router = Router();

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
