import { Request, Response } from "express";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authenticate";
import multer, { FileFilterCallback } from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary"; // Ensure this path matches your cloudinary config file location

// Configure multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => ({
    folder: "UserProfilePics", // Specify the folder name in Cloudinary
    format: "png", // Forces files to be saved as PNG
    public_id: new Date().toISOString(), // Use date as the image name to prevent overwriting
  }),
});

const parser = multer({ storage: storage });

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select(
      "username email firstName lastName profilePicture role createdAt"
    );
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadProfilePicture = async (
  req: AuthenticatedRequest & { file?: Express.Multer.File },
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Save the URL from Cloudinary in the User model
    user.profilePicture = req.file.path; // Cloudinary URL is returned here
    await user.save();

    res.status(200).json({ profilePicture: user.profilePicture });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
