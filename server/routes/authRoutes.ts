import { Router } from "express";
import {
  registerUser,
  loginUser,
  updateProfile, // Make sure this is correctly imported
} from "../controllers/authController";
import authenticate from "../middleware/authenticate"; // Import the authenticate middleware

const router = Router();

// Define the routes
router.post("/register", registerUser); // Route for user registration
router.post("/login", loginUser); // Route for user login
router.put("/update-profile", authenticate, updateProfile); // Protected route for updating profile info

export default router;
