import { Router } from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
  checkPassword,
  validateToken,
} from "../controllers/authController";
import {
  getUserProfile,
  uploadProfilePicture,
} from "../controllers/userController";
import authenticate from "../middleware/authenticate";
import { createUploadMiddleware } from "../middleware/upload"; // Import the factory function

// Create middleware for profile picture uploads (folder: UserProfilePics)
const profileImageUpload = createUploadMiddleware("UserProfilePics");

const router = Router();

// Define the routes
router.post("/register", registerUser); // Route for user registration
router.post("/login", loginUser); // Route for user login
router.put("/update-profile", authenticate, updateProfile); // Protected route for updating profile info
router.post("/check-password", authenticate, checkPassword); // Protected route for checking password
router.get("/user-profile", authenticate, getUserProfile); // Protected route for getting user profile

// Profile picture upload using Cloudinary
router.post(
  "/upload-profile-picture",
  authenticate,
  profileImageUpload.single("profilePicture"),
  uploadProfilePicture
);

router.post("/validate-token", validateToken); // Route for validating the token

export default router;
