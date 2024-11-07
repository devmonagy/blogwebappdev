// server/routes/authRoutes.ts
import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = Router();

// Define the routes
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
