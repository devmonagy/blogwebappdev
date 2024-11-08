"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/routes/authRoutes.ts
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController"); // Import getUserProfile
const authenticate_1 = __importDefault(require("../middleware/authenticate")); // Import the authenticate middleware
const router = (0, express_1.Router)();
// Define the routes
router.post("/register", authController_1.registerUser); // Route for user registration
router.post("/login", authController_1.loginUser); // Route for user login
router.put("/update-profile", authenticate_1.default, authController_1.updateProfile); // Protected route for updating profile info
router.get("/user-profile", authenticate_1.default, userController_1.getUserProfile); // Protected route for getting user profile
exports.default = router;
