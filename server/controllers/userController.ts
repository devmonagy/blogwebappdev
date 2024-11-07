import { Request, Response } from "express";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authenticate"; // Import the extended Request type

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = await User.findById(req.userId); // TypeScript should recognize userId now
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
