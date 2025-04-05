import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";

// Create a new post
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title, category, content } = req.body;
  const imagePath = req.file ? req.file.path : "";

  try {
    const userId = (req as any).userId;
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
    next(error);
  }
};

// Get all posts
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = await Post.find().populate("author");
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// Get a single post by ID
export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("author");
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// Update a post by ID
export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { title, category, content } = req.body;
  const imagePath = req.file ? req.file.path : "";

  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (
      post.author.toString() !== (req as any).userId &&
      !(req as any).isAdmin
    ) {
      res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
      return;
    }

    post.title = title || post.title;
    post.category = category || post.category;
    post.content = content || post.content;
    post.imagePath = imagePath || post.imagePath;

    await post.save();
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    next(error);
  }
};

// Delete a post by ID
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: "Post not found." });
      return;
    }

    if (
      post.author.toString() !== (req as any).userId &&
      !(req as any).isAdmin
    ) {
      res
        .status(403)
        .json({ message: "You are not authorized to delete this post." });
      return;
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post." });
  }
};
