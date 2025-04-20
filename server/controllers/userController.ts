// server/controllers/userController.ts

import { Request, Response } from "express";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authenticate";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

// ✅ Configure multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => ({
    folder: "UserProfilePics",
    format: "png",
    public_id: new Date().toISOString(),
  }),
});

export const parser = multer({ storage });

// ✅ Get user profile
export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      _id: user._id,
      username: (user as any).username || null,
      email: user.email,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      profilePicture: user.profilePicture || "",
      role: user.role,
      createdAt: user.createdAt,
      bio: typeof user.bio === "string" ? user.bio : "", // ✅ Safely return string
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Upload profile picture
export const uploadProfilePicture = async (
  req: AuthenticatedRequest & { file?: Express.Multer.File },
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (req.file?.path) {
      user.profilePicture = req.file.path;
      await user.save();
    }

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
