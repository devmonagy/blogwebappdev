"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/routes/authRoutes.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController"); // Import getUserProfile and uploadProfilePicture
const authenticate_1 = __importDefault(require("../middleware/authenticate")); // Import the authenticate middleware
const router = (0, express_1.Router)();
// Set up multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Specify the folder for storing uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename
    },
});
const upload = (0, multer_1.default)({ storage });
// Define the routes
router.post("/register", authController_1.registerUser); // Route for user registration
router.post("/login", authController_1.loginUser); // Route for user login
router.put("/update-profile", authenticate_1.default, authController_1.updateProfile); // Protected route for updating profile info
router.post("/check-password", authenticate_1.default, authController_1.checkPassword); // Protected route for checking password
router.get("/user-profile", authenticate_1.default, userController_1.getUserProfile); // Protected route for getting user profile
router.post("/upload-profile-picture", authenticate_1.default, upload.single("profilePicture"), // Use multer to handle single file upload
userController_1.uploadProfilePicture // Controller to handle the uploaded file
);
router.post("/validate-token", authController_1.validateToken); // Route for validating the token
exports.default = router;
