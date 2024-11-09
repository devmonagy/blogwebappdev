// server/routes/postRoutes.ts
import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
} from "../controllers/postController";
import authenticate from "../middleware/authenticate";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.post("/create", authenticate, upload.single("image"), createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);

export default router; // Use default export
