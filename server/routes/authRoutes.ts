// server/routes/authRoutes.ts
import { Router } from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
} from "../controllers/authController";
import { getUserProfile } from "../controllers/userController"; // Import getUserProfile
import authenticate from "../middleware/authenticate"; // Import the authenticate middleware

const router = Router();

// Define the routes
router.post("/register", registerUser); // Route for user registration
router.post("/login", loginUser); // Route for user login
router.put("/update-profile", authenticate, updateProfile); // Protected route for updating profile info
router.get("/user-profile", authenticate, getUserProfile); // Protected route for getting user profile

export default router;
