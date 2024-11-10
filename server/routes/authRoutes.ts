// server/routes/authRoutes.ts
import { Router } from "express";
import multer from "multer";
import {
  registerUser,
  loginUser,
  updateProfile,
  checkPassword, // Import the checkPassword function
  validateToken, // Import the validateToken function
} from "../controllers/authController";
import {
  getUserProfile,
  uploadProfilePicture, // Import uploadProfilePicture
} from "../controllers/userController"; // Import getUserProfile and uploadProfilePicture
import authenticate from "../middleware/authenticate"; // Import the authenticate middleware

const router = Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder for storing uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename
  },
});

const upload = multer({ storage });

// Define the routes
router.post("/register", registerUser); // Route for user registration
router.post("/login", loginUser); // Route for user login
router.put("/update-profile", authenticate, updateProfile); // Protected route for updating profile info
router.post("/check-password", authenticate, checkPassword); // Protected route for checking password
router.get("/user-profile", authenticate, getUserProfile); // Protected route for getting user profile
router.post(
  "/upload-profile-picture",
  authenticate,
  upload.single("profilePicture"), // Use multer to handle single file upload
  uploadProfilePicture // Controller to handle the uploaded file
);
router.post("/validate-token", validateToken); // Route for validating the token

export default router;
