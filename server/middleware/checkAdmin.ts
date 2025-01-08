import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById((req as any).userId);

    if (!user || user.role !== "admin") {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in checkAdmin middleware:", error);
    res.status(500).json({ message: "Server error." });
  }
};
