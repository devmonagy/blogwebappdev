import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extended request interface to include userId and userRole
export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

// Auth middleware to verify token and extract user info
const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "Access denied. No token provided." });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(400).json({ error: "Invalid token." });
  }
};

export default authenticate;
