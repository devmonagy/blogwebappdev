// server/controllers/userController.ts
import { Response } from "express";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authenticate";

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

    // Ensure `createdAt` is sent in the response
    res.status(200).json({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt, // Correctly include the `createdAt` field
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
