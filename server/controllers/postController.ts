import { Request, Response } from "express";
import Post from "../models/Post";
import { AuthenticatedRequest } from "../middleware/authenticate"; // Import your custom AuthenticatedRequest type

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  const { title, category, content } = req.body;
  let imagePath = "";

  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  try {
    const newPost = new Post({
      title,
      category,
      content,
      imagePath,
      author: req.userId, // Assuming userId is attached to the req object by your middleware
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("author");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};
