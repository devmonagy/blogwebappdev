import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include the userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

const authenticate: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next(); // Call next() to continue to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default authenticate;
