"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
// Create a new post
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, category, content } = req.body;
    let imagePath = "";
    if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
    }
    try {
        const userId = req.userId; // Assuming userId is attached to the req object by your middleware
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const newPost = new Post_1.default({
            title,
            category,
            content,
            imagePath,
            author: userId,
        });
        yield newPost.save();
        res.status(201).json(newPost);
    }
    catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});
exports.createPost = createPost;
// Get all posts
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find().populate("author");
        res.status(200).json(posts);
    }
    catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});
exports.getPosts = getPosts;
// Get a single post by ID
const getPostById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield Post_1.default.findById(id).populate("author");
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(post);
    }
    catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});
exports.getPostById = getPostById;
// Update a post by ID
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, category, content } = req.body;
    const userId = req.userId; // Assuming userId is attached to the req object by your middleware
    let imagePath;
    if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
    }
    try {
        const post = yield Post_1.default.findById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        // Check if the logged-in user is the author of the post
        if (post.author.toString() !== userId) {
            res
                .status(403)
                .json({ message: "You are not authorized to update this post" });
            return;
        }
        // Update the post fields
        if (title)
            post.title = title;
        if (category)
            post.category = category;
        if (content)
            post.content = content;
        if (imagePath)
            post.imagePath = imagePath;
        yield post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    }
    catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});
exports.updatePost = updatePost;
// Delete a post by ID
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userId; // Assuming userId is attached to the req object by your middleware
    try {
        const post = yield Post_1.default.findById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        // Check if the logged-in user is the author of the post
        if (post.author.toString() !== userId) {
            res
                .status(403)
                .json({ message: "You are not authorized to delete this post" });
            return;
        }
        yield post.deleteOne(); // Use deleteOne instead of remove
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});
exports.deletePost = deletePost;
