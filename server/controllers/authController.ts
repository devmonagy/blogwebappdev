import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Extend the Request interface to include userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(400).json({ error: "Username already taken" });
      return;
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to the database
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Find the user by either username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { firstName, lastName, email } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  try {
    // Find the user by ID and update their profile information
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
