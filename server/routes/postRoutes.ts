// server/routes/postRoutes.ts
import { Router } from "express";
import { createPost, getPosts } from "../controllers/postController";
import authenticate from "../middleware/authenticate";
import multer from "multer";

// Configure multer for handling image uploads
const upload = multer({ dest: "uploads/" });

const router = Router();

// Route to create a post (Requires authentication and image upload)
router.post("/create", authenticate, upload.single("image"), createPost);

// Public route to get posts (No authentication required)
router.get("/", getPosts);

export default router;
