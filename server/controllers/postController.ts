import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";

// Create a new post
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, category, content } = req.body;
  let imagePath = "";

  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  try {
    const userId = (req as any).userId; // Assuming userId is attached to the req object by your middleware
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const newPost = new Post({
      title,
      category,
      content,
      imagePath,
      author: userId,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

// Get all posts
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find().populate("author");
    res.status(200).json(posts);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

// Get a single post by ID
export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("author");
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

// Delete a post by ID
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userId = (req as any).userId; // Assuming userId is attached to the req object by your middleware

  try {
    const post = await Post.findById(id);
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

    await post.deleteOne(); // Use deleteOne instead of remove
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};
