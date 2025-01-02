"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const multer_1 = __importDefault(require("multer"));
// Configure multer for file uploads
const upload = (0, multer_1.default)({ dest: "uploads/" });
const router = (0, express_1.Router)();
// Route to create a new post (with authentication and file upload)
router.post("/create", authenticate_1.default, upload.single("image"), postController_1.createPost);
// Route to get all posts
router.get("/", postController_1.getPosts);
// Route to get a single post by ID
router.get("/:id", postController_1.getPostById);
// Route to update a post by ID (with authentication and file upload)
router.put("/:id", authenticate_1.default, upload.single("image"), postController_1.updatePost);
// Route to delete a post by ID (with authentication)
router.delete("/:id", authenticate_1.default, postController_1.deletePost);
exports.default = router;
