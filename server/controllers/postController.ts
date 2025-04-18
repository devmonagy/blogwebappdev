import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Post from "../models/Post";
import { AuthenticatedRequest } from "../middleware/authenticate";

// ✅ Create a new post
export const createPost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title, category, content } = req.body;
  const imagePath = req.file ? req.file.path : "";

  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const newPost = new Post({
      title,
      category,
      content,
      imagePath,
      author: req.userId,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

// ✅ Get all posts with clapsCount and commentsCount
export const getPosts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentsCount: { $size: "$comments" },
          clapsCount: "$claps",
        },
      },
      {
        $project: {
          comments: 0,
          claps: 0,
          userClaps: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    const populatedPosts = await Post.populate(posts, {
      path: "author",
      select: "firstName lastName profilePicture",
    });

    res.status(200).json(populatedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    next(error);
  }
};

// ✅ Get a single post by ID
export const getPostById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate(
      "author",
      "firstName lastName profilePicture"
    );
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// ✅ Get total claps + user claps
export const getPostClaps = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found." });
      return;
    }

    let userClaps = 0;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      if (decoded?.userId) {
        const userClapRecord = post.userClaps.find(
          (uc) => uc.userId.toString() === decoded.userId
        );
        userClaps = userClapRecord ? userClapRecord.count : 0;
      }
    }

    res.status(200).json({
      claps: post.claps,
      userClaps,
    });
  } catch (error) {
    console.error("Error fetching claps:", error);
    res.status(500).json({ message: "Failed to fetch claps." });
  }
};

// ✅ Get users who clapped
export const getClapUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate(
      "userClaps.userId",
      "firstName lastName profilePicture"
    );

    if (!post) {
      res.status(404).json({ message: "Post not found." });
      return;
    }

    if (post.claps === 0 && post.userClaps.length > 0) {
      post.userClaps = [];
      await post.save();
    }

    const clapUsers = post.userClaps.map((entry) => {
      const user = entry.userId as any;
      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        claps: entry.count,
      };
    });

    res.status(200).json(clapUsers);
  } catch (error) {
    console.error("Error fetching clap users:", error);
    res.status(500).json({ message: "Failed to fetch clap users." });
  }
};

// ✅ Undo all user claps
export const undoUserClaps = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { postId } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found." });
      return;
    }

    const index = post.userClaps.findIndex(
      (entry) => entry.userId.toString() === userId
    );

    if (index === -1) {
      res.status(400).json({ message: "No claps to undo." });
      return;
    }

    const userClapCount = post.userClaps[index].count;
    post.claps = Math.max(0, post.claps - userClapCount);
    post.userClaps.splice(index, 1);

    await post.save();

    const updatedPost = await Post.findById(postId).populate(
      "userClaps.userId",
      "firstName lastName profilePicture"
    );

    const updatedClapUsers =
      updatedPost?.userClaps.map((entry) => {
        const user = entry.userId as any;
        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          claps: entry.count,
        };
      }) || [];

    res.status(200).json({
      message: "Claps undone successfully.",
      claps: post.claps,
      userClaps: 0,
      clapUsers: updatedClapUsers,
    });
  } catch (error) {
    console.error("Error undoing claps:", error);
    res.status(500).json({ message: "Server error while undoing claps." });
  }
};

// ✅ Update a post
export const updatePost = async (
  req: AuthenticatedRequest,
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

    const isAdmin = req.userRole === "admin";

    if (post.author.toString() !== req.userId && !isAdmin) {
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

// ✅ Delete a post
export const deletePost = async (
  req: AuthenticatedRequest,
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

    const isAdmin = req.userRole === "admin";

    if (post.author.toString() !== req.userId && !isAdmin) {
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
