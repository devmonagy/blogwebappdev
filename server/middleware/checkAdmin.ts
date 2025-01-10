import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized. User ID not found." });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (user.role === "admin") {
      (req as any).isAdmin = true; // Set isAdmin flag
    } else {
      (req as any).isAdmin = false;
    }

    next();
  } catch (error) {
    console.error("Error in checkAdmin middleware:", error);
    res.status(500).json({ message: "Server error." });
  }
};
