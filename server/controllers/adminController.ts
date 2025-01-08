// server/controllers/adminController.ts
import { Request, Response } from "express";
import User from "../models/User";

// Fetch all users with their roles (exclude sensitive fields like passwords)
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("username email firstName role"); // Include relevant fields
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Update the role of a specific user
export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      res.status(400).json({ message: "User ID and role are required." });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true } // Return the updated user and validate the role
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
