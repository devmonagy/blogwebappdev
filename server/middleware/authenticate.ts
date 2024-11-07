// server/middleware/authenticate.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include userId
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return; // Add a return statement to end the function
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = decoded.userId; // Attach the userId to the request object
    next(); // Call the next middleware
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
    return; // Add a return statement to end the function
  }
};

export default authenticate;
