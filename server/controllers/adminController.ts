// server/controllers/adminController.ts
import { Response } from "express";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authenticate";

// ✅ Fetch all users (admin only)
export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (req.userRole !== "admin") {
    res.status(403).json({ message: "Access denied." });
    return;
  }

  try {
    const users = await User.find().select(
      "username email firstName lastName role profilePicture"
    );
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ Update user role (admin only)
export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (req.userRole !== "admin") {
    res.status(403).json({ message: "Access denied." });
    return;
  }

  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      res.status(400).json({ message: "User ID and role are required." });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.json({ message: "User role updated successfully.", user });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Server error." });
  }
};
